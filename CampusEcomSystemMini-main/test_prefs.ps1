$ErrorActionPreference = "Continue"

# Login
$login = Invoke-RestMethod -Method POST -Uri "http://localhost:5067/api/auth/login" -ContentType "application/json" -Body '{"email":"testvector@example.com","password":"Password123!"}' -UseBasicParsing
$token = $login.token
$headers = @{Authorization = "Bearer $token"}
Write-Host "Logged in. Token length: $($token.Length)"

# Delete existing preferences
try {
  Invoke-WebRequest -Method DELETE -Uri "http://localhost:5067/api/users/me/preferences" -Headers $headers -UseBasicParsing -ErrorAction Stop
  Write-Host "Deleted existing preferences"
} catch {
  Write-Host "Delete: $($_.Exception.Message)"
}

# Step 1: Save study vector only (using ASCII alias keys that backend recognizes)
$studyJson = '{"studySubjects":["cau truc du lieu va giai thuat","lap trinh huong doi tuong"],"studyLanguages":["java","python"],"studyGoal":"on thi cuoi ky","studyProficiency":"co ban","studyTime":"buoi sang","studyFormat":"truc tiep","studyMethod":"giai bai tap","studyFrequency":"3 buoi mot tuan"}'
$resp = Invoke-WebRequest -Method POST -Uri "http://localhost:5067/api/users/me/preferences" -ContentType "application/json" -Headers $headers -Body $studyJson -UseBasicParsing -ErrorAction Stop
Write-Host "=== POST study: $($resp.StatusCode) ==="
Write-Host $resp.Content

# Step 2: GET - verify study data persisted
$get1 = Invoke-WebRequest -Method GET -Uri "http://localhost:5067/api/users/me/preferences" -Headers $headers -UseBasicParsing -ErrorAction Stop
Write-Host "`n=== GET after study ==="
Write-Host $get1.Content

# Step 3: Save room vector only
$roomJson = '{"roomArea":"ba dinh","roomBudgetRaw":"duoi 2 trieu","roomType":"phong tro khep kin","roomSleepSchedule":"ngu som","roomCleanliness":"rat sach se nan nap","roomNoisePreference":"can rat yen tin","roomCookingHabits":"khong nau an","roomAmenities":["dieu hoa","may giat"]}'
$resp2 = Invoke-WebRequest -Method PUT -Uri "http://localhost:5067/api/users/me/preferences" -ContentType "application/json" -Headers $headers -Body $roomJson -UseBasicParsing -ErrorAction Stop
Write-Host "`n=== PUT room: $($resp2.StatusCode) ==="
Write-Host $resp2.Content

# Step 4: GET - verify BOTH study and room data persisted (THE KEY TEST)
$get2 = Invoke-WebRequest -Method GET -Uri "http://localhost:5067/api/users/me/preferences" -Headers $headers -UseBasicParsing -ErrorAction Stop
Write-Host "`n=== GET after room (BOTH should be present) ==="
Write-Host $get2.Content

# Step 5: Verify study fields still present after room save
$data = $get2.Content | ConvertFrom-Json
$studyOk = $data.studySubjects -ne $null -and $data.studySubjects.Count -gt 0
$roomOk = $data.roomArea -eq "Ba Đình"
Write-Host "`n=== VERIFICATION ==="
Write-Host "Study subjects preserved: $studyOk ($($data.studySubjects -join ', '))"
Write-Host "Room area preserved: $roomOk ($($data.roomArea))"
if ($studyOk -and $roomOk) {
  Write-Host "PERSISTENCE TEST: PASS - both vectors intact after saving each independently"
} else {
  Write-Host "PERSISTENCE TEST: FAIL - data was lost!"
}
