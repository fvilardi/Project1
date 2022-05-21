using System;

namespace Code_Challenge
{
    public abstract class BaseResponse
    {
            public bool IsSuccessful { get; set; }

            public string TransactionId { get; set; }

            public BaseResponse()
            {
                //This TxId I am just faking to demo the purpose
                this.TransactionId = Guid.NewGuid().ToString();
            }
    }
}
