using Application.Interfaces;

namespace Application.FacadeService
{
    public class FacadeService : IFacadeService
    {
        public IAuthorizeService AuthorizeService { get; }
        public FacadeService(
            IAuthorizeService authorizeService
        )
        {
            AuthorizeService = authorizeService;
        }
    }
}
