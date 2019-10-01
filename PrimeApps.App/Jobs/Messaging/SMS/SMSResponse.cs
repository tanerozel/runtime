﻿using PrimeApps.Model.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PrimeApps.App.Jobs.Messaging.SMS
{
    public class SMSResponse
    {
        public NotificationStatus Status { get; set; }
        public string Response { get; set; }
    }
}