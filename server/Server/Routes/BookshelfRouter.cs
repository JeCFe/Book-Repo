namespace Server.Routes;

using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Server.Context;
using Server.Models;
using Server.Providers;

public static class BookshelfRouter
{
    private static async Task<Results<Ok<Bookshelf>, NotFound>> GetBookshelf(
        [FromRoute] Guid bookshelfId,
        [FromServices] IBookshelfProvider bookshelfProvider,
        [FromServices] IUserContext userContext,
        CancellationToken cancellationToken
    )
    {
        var bookshelf = await bookshelfProvider.GetBookshelfById(bookshelfId, cancellationToken);
        if (bookshelf is not { })
        {
            return TypedResults.NotFound();
        }
        return TypedResults.Ok(bookshelf);
    }

    public static RouteGroupBuilder MapBookshelfEndpoints(this RouteGroupBuilder group)
    {
        group.WithTags("Bookshelf");
        group.MapGet("/{bookshelfId}", GetBookshelf);

        return group;
    }
}