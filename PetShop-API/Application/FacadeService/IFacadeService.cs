using Application.Interfaces;

namespace Application.FacadeService
{
    public interface IFacadeService
    {
        IAuthorizeService AuthorizeService { get; }
    }
}
