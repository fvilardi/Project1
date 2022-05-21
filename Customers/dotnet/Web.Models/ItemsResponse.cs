using System.Collections.Generic;

namespace Code_Challenge
{
    public class ItemsResponse<T> : SuccessResponse
    {
            public List<T> Items { get; set; }
        
    }
}