﻿// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.


namespace PrimeApps.Auth.UI
{
    public class LogoutInputModel
    {
        public string LogoutId { get; set; }

        public string ReturnUrl { get; set; }

        public string Error { get; set; }
    }
}