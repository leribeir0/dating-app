namespace API.Errors
{
    public class ApiException
    {
        public ApiException(int statusCode, string message = null, string detaiils = null)
        {
            StatusCode = statusCode;
            Message = message;
            Detaiils = detaiils;
        }

        public int StatusCode { get; set; }
        public string Message { get; set; }
        public string Detaiils { get; set; }
    }
}