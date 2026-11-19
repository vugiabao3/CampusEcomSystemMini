using CampusEcomSystemMini.Application.Auth.Register;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using CampusEcomSystemMini.Application.Auth.Login;
using Microsoft.AspNetCore.Authorization;
using CampusEcomSystemMini.Application.Auth.Me;
using CampusEcomSystemMini.Application.Auth.Logout;
namespace CampusEcomSystemMini.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IMediator _mediator;
    

    public AuthController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterCommand command, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(command, cancellationToken);
        return StatusCode(201,result);
    }

     [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login(
        LoginCommand command,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            command,
            cancellationToken);

        return Ok(result);
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<MeResponse>> Me(
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new MeQuery(),
            cancellationToken);

        return Ok(result);
    }

    [Authorize]
[HttpPost("logout")]
public async Task<IActionResult> Logout(
    CancellationToken cancellationToken)
{
    await _mediator.Send(
        new LogoutCommand(),
        cancellationToken);

    return Ok(new
    {
        message = "Logout successful."
    });
}

    
}