﻿using Microsoft.Extensions.Configuration;
using PrimeApps.Model.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PrimeApps.Model.Helpers;

namespace PrimeApps.App.Helpers
{
    public interface IEnvironmentHelper
    {
        List<T> DataFilter<T>(List<T> data);
        T DataFilter<T>(T data);
        int GetEnvironmentValue();
    }

    public class EnvironmentHelper : IEnvironmentHelper
    {
        private IConfiguration _configuration;

        public EnvironmentHelper(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public List<T> DataFilter<T>(List<T> data)
        {
            if (data == null || data.Count < 1)
                return data;

            var environmentType = GetEnvironmentValue();

            var prop = typeof(T).GetProperty("Environment");
            var newData = new List<T>();

            foreach (var item in data)
            {
                if (prop.GetValue(item) == null)
                {
                    newData.Add(item);
                    continue;
                }

                var value = prop.GetValue(item).ToString();

                if (value != null)
                {
                    var environmentValues = value.Split(',').Select(Int32.Parse).ToList();

                    if (environmentValues.Any(q => q >= environmentType))
                        newData.Add(item);
                }
            }

            return newData;
        }

        public T DataFilter<T>(T data)
        {
            if (data == null)
                return default(T);

            var environmentType = GetEnvironmentValue();

            var prop = typeof(T).GetProperty("Environment");

            if (prop.GetValue(data) == null)
                return data;

            var value = prop.GetValue(data).ToString();

            if (value != null)
            {
                var environmentValues = value.Split(',').Select(Int32.Parse).ToList();

                if (environmentValues.Any(q => q >= environmentType))
                    return data;
            }

            return default(T);
        }

        public int GetEnvironmentValue()
        {
            var environment = !string.IsNullOrEmpty(_configuration.GetValue("AppSettings:Environment", string.Empty)) ? _configuration.GetValue("AppSettings:Environment", string.Empty) : "development";
            var environmentValue = (int)environment.ToEnum<EnvironmentType>();

            return environmentValue;
        }
    }
}