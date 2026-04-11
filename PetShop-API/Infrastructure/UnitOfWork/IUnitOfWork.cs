namespace Infrastructure.UnitOfWork
{
    public interface IUnitOfWork
    {
        Task SaveAsync();
    }
}
