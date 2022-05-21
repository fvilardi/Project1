namespace Code_Challenge
{
    public interface IItemResponse
    {
        bool IsSuccessful { get; set; }
        string TransactionId { get; set; }
        object Item { get; }
    }
}