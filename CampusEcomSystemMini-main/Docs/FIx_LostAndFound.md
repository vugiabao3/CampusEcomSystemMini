

# Fix_LostAndFound.md
# Complete Lost & Found Refactoring — Backend + Frontend

## 1. ROLE AND OBJECTIVE

Act as a senior full-stack engineer specializing in ASP.NET Core, Clean Architecture, Entity Framework Core, SQL Server, React, Vite, REST APIs, geocoding, and location-based search.

Your task is to thoroughly inspect, refactor, repair, and complete the existing Lost & Found feature in the CampusEcomSystemMini project.

You must modify the existing project directly. Do not merely provide recommendations, code snippets, or a list of suggested changes.

The final result must include a working backend and frontend integration.

### Main objectives

1. Remove the Google Maps dependency from Lost & Found wherever it is no longer necessary.
2. Replace manual map pin placement with address input and automatic geocoding.
3. Implement address autocomplete similar to the location-search experience in ride-hailing applications.
4. Automatically resolve the selected address into latitude and longitude.
5. Persist the resolved address and coordinates in SQL Server.
6. Calculate geographic distances between Lost & Found posts using the Haversine formula.
7. Support nearby Lost & Found searches using the existing 500-meter requirement.
8. Implement complete create, read, update, and delete workflows for Lost & Found posts.
9. Integrate all changes with the existing React/Vite frontend and ASP.NET Core backend.
10. Preserve all existing working modules, authentication, authorization, business rules, and UI functionality.

Do not rebuild the entire application unnecessarily. Inspect the existing architecture first and modify only the files required to implement this feature correctly.

---

## 2. MANDATORY PROJECT INSPECTION

Before modifying any code, inspect the repository thoroughly.

Read the following documentation if present:

- `Docs/AI_GUIDE.md`
- `Docs/MODULE_1.md`
- `Docs/MODULE_2.md`
- `Docs/MODULE_3.md`
- `Docs/MODULE_4.md`
- `Docs/MODULE_5.md`
- `Docs/MODULE_6.md`
- Existing Lost & Found specifications and implementation notes.
- Existing API contracts, database conventions, and frontend integration instructions.

Inspect the existing implementation, including:

- Lost & Found entities and DTOs.
- Lost & Found controllers.
- Create, update, delete, and query handlers.
- Application interfaces and repositories.
- Infrastructure implementations.
- EF Core DbContext, entity configurations, and migrations.
- Dependency injection registrations.
- Authentication and authorization.
- Current-user access and ownership validation.
- Existing location fields and distance calculations.
- React pages, components, hooks, API services, and forms.
- Existing Google Maps components, API keys, environment variables, scripts, and packages.
- Existing tests and build configuration.

Search the entire repository for Google Maps references and determine which ones belong to Lost & Found.

Do not assume that all Google Maps references belong to Lost & Found. Other modules may still depend on them.

Before editing, produce a concise implementation plan based on the actual files found.

Do not stop after writing the plan. Continue implementing the feature.

---

## 3. TARGET LOCATION ARCHITECTURE

Use an address-based geocoding workflow instead of requiring users to manually place map pins.

The intended flow is:

1. The user opens a Lost & Found create or edit form.
2. The user types an address.
3. The frontend displays relevant address suggestions.
4. The user selects a suggestion.
5. The frontend receives the selected address and its latitude/longitude.
6. The frontend submits the selected address and coordinates to the backend.
7. The backend validates the request and persists the location.
8. Nearby searches use the persisted coordinates and the Haversine formula.

Example user input:

`72 Tran Dai Nghia, Hai Ba Trung, Hanoi, Vietnam`

Example resolved data:

- `Address`: the selected formatted address.
- `Latitude`: the resolved latitude.
- `Longitude`: the resolved longitude.

The example coordinates must not be hardcoded. Always use coordinates returned by the geocoding provider.

The user must not be required to manually type latitude or longitude.

The user must not be required to place a pin on a Google Map.

A map preview is optional and must not be required for the workflow.

---

## 4. GEOCODING PROVIDER AND AUTOCOMPLETE

### 4.1 Use an abstraction

Create or reuse an application-level geocoding abstraction following the existing Clean Architecture conventions.

Suggested interface:

`IGeocodingService`

It should expose operations equivalent to:

- Search address suggestions.
- Resolve an address when necessary.

Use suitable DTOs, such as:

- `AddressSuggestionDto`
- `GeocodingResultDto`

Adapt names and namespaces to the existing project instead of creating unnecessary duplicates.

The Application layer must not directly depend on an HTTP client implementation or provider-specific response models.

Implement the provider integration in Infrastructure.

### 4.2 Preferred provider

Use Photon backed by OpenStreetMap data for address autocomplete, provided that its public service is suitable for the project's expected low-volume demonstration usage.

Official project:

`https://photon.komoot.io/`

Use the provider's documented API and response format. Do not invent response fields or assume that every query produces an exact street address.

The provider must be configurable so that it can be replaced without rewriting controllers, handlers, or frontend business logic.

Do not implement autocomplete by sending one request per keystroke directly to the public Nominatim API. Nominatim's public service explicitly prohibits this usage pattern.

Do not silently switch to Google Maps or another paid provider.

If Photon is unavailable or its current public-service terms make the proposed usage unsuitable, document the limitation and implement the provider behind the same abstraction so a compliant alternative can be configured.

### 4.3 Backend endpoint

Add or adapt an endpoint similar to:

`GET /api/lost-found/locations/suggestions?q={query}`

Requirements:

- Require a minimum query length, normally 3 characters.
- Return a small, configurable number of suggestions, such as 5–8.
- Return a stable DTO containing the formatted address and resolved coordinates.
- Validate empty, excessively long, or invalid queries.
- URL-encode the search query.
- Use `IHttpClientFactory`.
- Configure timeouts and appropriate cancellation tokens.
- Handle provider errors and malformed responses gracefully.
- Never expose provider credentials or internal exceptions to the frontend.
- Apply suitable rate limiting to prevent abuse.
- Do not return fabricated coordinates when the provider fails.
- Return clear, predictable API responses.

Follow the project's existing API response conventions where possible.

### 4.4 Autocomplete performance and reliability

Implement the following:

- Frontend debounce, approximately 300–500 milliseconds.
- Do not search before the minimum query length is reached.
- Cancel obsolete frontend requests when the user continues typing.
- Ignore stale responses that arrive after a newer query.
- Show a loading indicator.
- Show a no-results state.
- Show a useful error state.
- Avoid duplicate requests for identical queries where practical.
- Limit the number of displayed suggestions.
- Prevent excessive requests to the public geocoding provider.
- Apply backend rate limiting and short-lived caching where appropriate.
- Do not implement unbounded caching or persistent storage of every arbitrary query.

Respect the chosen provider's terms, attribution requirements, and rate limits.

If attribution is required, display an appropriate OpenStreetMap attribution notice near the location input or suggestions.

### 4.5 Selected-address integrity

Selecting a suggestion must establish a valid relationship between the address and its coordinates.

The frontend must not retain old coordinates after the user changes the address text.

If the user edits a previously selected address, invalidate the previous selection until another valid suggestion is selected or the backend successfully resolves the new address.

The UI must distinguish between:

- Text entered by the user.
- A suggestion selected by the user.
- A valid location ready for submission.

Never silently submit coordinates belonging to a different address.

The backend must not blindly trust arbitrary coordinates sent by the frontend.

Validate latitude and longitude ranges and verify that the submitted location is consistent with the chosen address using the provider or a suitable server-side validation strategy.

Avoid making redundant geocoding requests on every create or update. Reuse a validated selection or cached result when appropriate.

---

## 5. DATABASE AND ENTITY CHANGES

Inspect the existing Lost & Found entity and database schema before making changes.

Reuse existing location properties if they already serve the same purpose.

The intended data model should support:

- Address or formatted address.
- Latitude.
- Longitude.
- Existing Lost & Found type/status.
- Existing owner/user relationship.
- Existing timestamps and audit fields, if present.

Use suitable types, preferably nullable decimal values only if compatible with the existing schema and calculations, or another existing consistent numeric convention.

Ensure that:

- Latitude is within -90 to 90.
- Longitude is within -180 to 180.
- Missing coordinates are handled explicitly.
- Database precision is sufficient for location calculations.
- Existing data is not accidentally destroyed.
- Existing foreign keys and indexes remain valid.
- Migrations are created only when the schema actually changes.

Do not reset the database or delete existing data to make migrations easier.

If old Lost & Found records contain Google Maps coordinates, determine whether those coordinates can be reused safely.

If they contain only incomplete or invalid locations, provide a safe migration or fallback strategy rather than fabricating coordinates.

Document the required EF Core migration and database update commands.

---

## 6. DISTANCE CALCULATION AND NEARBY SEARCH

Retain or implement a reusable Haversine distance calculation.

The calculation must use the Earth's radius in meters and return a distance in meters.

Use the resolved coordinates of two locations:

- Location A: latitude and longitude.
- Location B: latitude and longitude.

Nearby results must be filtered using the configured radius. Preserve the existing 500-meter requirement unless the project documentation explicitly specifies a different rule.

Requirements:

- Do not compare address strings to determine geographic distance.
- Do not use Euclidean distance on raw latitude/longitude.
- Do not require Google Maps to calculate distance.
- Handle missing coordinates explicitly.
- Prevent invalid numeric values from causing calculation errors.
- Use a suitable bounding-box or database filtering strategy before calculating exact distances when necessary.
- Avoid loading every Lost & Found record into memory for large datasets.
- Sort nearby results by increasing distance when the feature requires proximity ranking.
- Return distance only if appropriate for the existing API contract.
- Preserve existing Lost & Found filtering and status rules.

Be explicit that the Haversine result represents straight-line distance, not walking or driving distance.

---

## 7. COMPLETE LOST & FOUND BACKEND CRUD

Inspect the existing implementation before adding files.

Complete the following operations:

- Create Lost & Found post.
- Retrieve a Lost & Found post by ID.
- Retrieve or search Lost & Found posts.
- Update a Lost & Found post.
- Delete a Lost & Found post.
- Search nearby Lost & Found posts using the existing business rules.
- Retrieve address suggestions.

Use the project's established Clean Architecture and MediatR conventions.

Suggested Application structure, to be adapted to the actual repository:

`CampusEcomSystemMini.Application/LostFound/`

Organize commands, handlers, responses, queries, and DTOs clearly.

For write operations, follow the established project convention for Command, Handler, and Response. Do not create empty or redundant response classes if the existing convention uses a different valid response model.

### Create

- Validate required fields.
- Validate the Lost & Found category/type and status using existing business rules.
- Require a valid selected location when geographic matching depends on it.
- Ensure the current authenticated user is the owner.
- Persist the address and coordinates together.
- Return a stable response DTO.

### Update

- Verify the record exists.
- Verify the authenticated user owns the record, unless existing authorization rules explicitly allow an administrator.
- Validate the updated address and coordinates.
- Keep the address and coordinates consistent.
- Preserve fields that are not part of the update request.
- Do not permit users to overwrite protected ownership or audit fields.

### Delete

- Verify the record exists.
- Verify ownership or the applicable administrator permission.
- Follow the project's existing soft-delete or hard-delete convention.
- Preserve referential integrity.

### Read and nearby search

- Follow existing pagination, filtering, status, and authorization conventions.
- Avoid returning sensitive information.
- Ensure the returned location fields match the actual stored coordinates.

Do not bypass MediatR, repositories, interfaces, or other established architectural boundaries just to make the feature work quickly.

---

## 8. FRONTEND REFACTORING

Inspect the current React/Vite implementation before editing.

Identify the actual Lost & Found pages, forms, detail pages, API services, hooks, and components.

Remove the requirement for manual Google Maps pin placement from the Lost & Found workflow.

Replace it with a reusable address-autocomplete component.

Suggested component name:

`AddressAutocomplete`

Adapt the component name and location to the existing frontend architecture.

### The address input must support

1. Typing a partial address.
2. Displaying a dropdown of suggestions.
3. Selecting a suggestion.
4. Showing the selected formatted address.
5. Maintaining the selected latitude and longitude in form state.
6. Clearing the old selection when the address text changes.
7. Loading, empty-results, and error states.
8. Keyboard navigation and Enter/Escape behavior where practical.
9. Accessible labels and validation messages.
10. Mobile-friendly layout.

Use the existing styling system and design language.

Do not redesign unrelated pages.

### Create form

The user should only need to enter or select an address.

The frontend must submit the selected address and corresponding coordinates using the existing API conventions.

Do not require manual latitude/longitude entry.

### Edit form

- Load the current address and coordinates.
- Display the existing location correctly.
- Preserve valid location data when the user does not modify the address.
- Invalidate the selected location when the user changes the address.
- Prevent accidental submission of mismatched address and coordinates.

### Detail page

Display the address clearly.

If the current page contains a Google Maps embed or map-pin control that is unnecessary for Lost & Found, remove it or replace it with a simple address presentation.

Do not break existing image galleries, post details, status information, owner information, claims, or other existing functionality.

### List and nearby results

Preserve existing filters and pagination.

Display relevant location information and nearby results according to the existing product design.

Do not introduce a mandatory map view.

---

## 9. REMOVE OBSOLETE GOOGLE MAPS DEPENDENCIES SAFELY

Search for all Google Maps dependencies related to Lost & Found, including:

- React components.
- Hooks and utilities.
- API calls.
- Environment variables.
- Configuration entries.
- Google Maps API key references.
- Package dependencies used exclusively by Lost & Found.
- Map scripts and embedded map URLs.
- Old DTOs or properties used only for manual pin placement.
- Documentation and setup instructions.

For each dependency, determine whether it is still used by another module.

Remove obsolete Lost & Found dependencies only after replacing their functionality.

Do not remove shared packages or configuration required by other modules.

Do not delete environment variables used elsewhere.

Do not blindly delete latitude/longitude fields. These fields are still needed for geographic matching even though manual Google Maps pin placement is removed.

Do not leave broken imports, unused API calls, dead UI controls, or references to deleted components.

Update relevant documentation to explain the new geocoding workflow.

---

## 10. SECURITY AND PRIVACY

- Require authentication for creating, updating, and deleting posts according to existing authorization rules.
- Enforce ownership checks on the backend.
- Validate all incoming fields.
- Do not expose API secrets in React environment variables.
- Avoid logging sensitive user information or complete private addresses unnecessarily.
- Do not expose internal provider exceptions.
- Do not fabricate successful geocoding results.
- Do not trust client-supplied coordinates without appropriate validation.
- Apply rate limiting to address searches.
- Respect the geocoding provider's privacy and usage policies.
- Do not send unrelated personal information to the geocoding provider.

Follow the project's existing JWT, role, and current-user conventions.

---

## 11. TESTING AND ACCEPTANCE CRITERIA

The task is not complete until the implementation has been verified as far as the available environment permits.

### Backend

Verify:

- The API project builds.
- All relevant Application and Infrastructure projects build.
- Dependency injection resolves the geocoding service.
- The address-suggestion endpoint handles valid queries.
- Empty and too-short queries are handled correctly.
- Provider failures are handled gracefully.
- Create persists the correct address and coordinates.
- Update maintains address-coordinate consistency.
- Delete enforces ownership.
- Invalid coordinates are rejected.
- Nearby search returns locations within the configured radius.
- Locations outside the radius are excluded.
- Missing coordinates do not crash searches.
- Existing authentication and authorization still work.
- Existing Lost & Found business rules remain intact.

### Frontend

Verify:

- The Lost & Found create form works.
- Address autocomplete displays suggestions.
- Selecting a suggestion fills the location fields.
- Editing the address invalidates the old selection.
- The edit form correctly handles an existing location.
- Create and update submit the correct payload.
- Loading, empty, and error states work.
- Existing detail and list pages still work.
- No Lost & Found page requires a Google Maps API key.
- There are no broken imports or console errors caused by the changes.

### Regression

Build the relevant backend projects and frontend.

Run existing tests where available.

Inspect other modules that shared Google Maps components to ensure they have not been broken.

If SQL Server, the geocoding provider, or another dependency is unavailable, report the limitation clearly. Do not claim that an integration test passed if it was not executed.

---

## 12. IMPLEMENTATION RULES

Follow these rules throughout the task:

1. Read the existing code before changing it.
2. Reuse established patterns instead of creating duplicate abstractions.
3. Make real code changes in the repository.
4. Keep Application, Domain, Infrastructure, and API responsibilities separated.
5. Use asynchronous methods and cancellation tokens where appropriate.
6. Use parameterized EF Core queries.
7. Avoid unnecessary NuGet or npm packages.
8. Do not introduce Google Maps as a fallback.
9. Do not hardcode coordinates.
10. Do not fabricate provider responses.
11. Do not remove unrelated modules or existing features.
12. Do not overwrite unrelated user changes.
13. Do not create duplicate handlers, DTOs, or components.
14. Do not disable validation or authorization to make tests pass.
15. Do not stop after generating files; integrate and verify them.

If an existing implementation is already correct, preserve it rather than rewriting it for cosmetic reasons.

If a requirement conflicts with an existing documented business rule, inspect the documentation and resolve the conflict consistently instead of silently changing the business behavior.

---

## 13. FINAL REPORT

When finished, provide a concise but specific report containing:

1. Files created.
2. Files modified.
3. Files deleted, with the reason for each deletion.
4. Backend changes.
5. Frontend changes.
6. Geocoding provider and endpoint configuration.
7. Database migration requirements.
8. Google Maps dependencies removed from Lost & Found.
9. Tests and builds actually executed, including their results.
10. Any remaining limitations or manual setup steps.

Separate verified results from unverified assumptions.

Do not claim the feature is complete if important backend or frontend integration steps remain unfinished.

The final goal is a fully integrated Lost & Found feature in which users can enter and select an address, the system resolves and stores its coordinates, and the backend calculates nearby locations without requiring Google Maps or manual map-pin placement.