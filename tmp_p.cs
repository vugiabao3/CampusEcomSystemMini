using System;
using System.IO;

class P {
  static void Main() {
    string path = @"CampusEcomSystemMini-main/CampusEcomSystemMini.Api/Controllers/LostFoundController.cs";
    string c = File.ReadAllText(path, System.Text.Encoding.UTF8);
    c = c.Replace("using CampusEcomSystemMini.Application.LostFound.SecretQuestions.GetSecretQuestion;\r\n",
                 "using CampusEcomSystemMini.Application.LostFound.SecretQuestions.GetSecretQuestion;\r\nusing CampusEcomSystemMini.Application.LostFound.GetLostFoundById;\r\n");
    string endpoint = "    // GET /api/lost-found/{postId}\r\n    [HttpGet(\"{postId:guid}\")]\r\n    public async Task<ActionResult<GetLostFoundByIdResponse>> GetLostFoundById(\r\n        Guid postId,\r\n        CancellationToken cancellationToken)\r\n    {\r\n        var result = await _mediator.Send(\r\n            new GetLostFoundByIdQuery(postId),\r\n            cancellationToken);\r\n\r\n        if (result is null)\r\n        {\r\n            return NotFound();\r\n        }\r\n\r\n        return Ok(result);\r\n    }\r\n\r\n";
    c = c.Replace("    // PUT /api/lost-found/{postId}/returned", endpoint + "    // PUT /api/lost-found/{postId}/returned");
    File.WriteAllText(path, c, System.Text.Encoding.UTF8);
    Console.WriteLine("ok");
  }
}
