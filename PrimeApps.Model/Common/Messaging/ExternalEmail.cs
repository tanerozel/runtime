﻿namespace PrimeApps.Model.Common.Messaging
{
    public class ExternalEmail
    {
        public string Subject { get; set; }
        public string TemplateWithBody { get; set; }
        public string[] ToAddresses { get; set; }

    }
}
