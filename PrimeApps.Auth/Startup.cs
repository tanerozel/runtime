﻿using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Razor;
using System.Globalization;
using Microsoft.AspNetCore.Localization;
using Newtonsoft.Json.Serialization;
using Newtonsoft.Json.Converters;
using Microsoft.AspNetCore.HttpOverrides;

namespace PrimeApps.Auth
{
	public partial class Startup
	{
		public IConfiguration Configuration { get; }

		public Startup(IConfiguration configuration)
		{
			Configuration = configuration;
		}

		public void ConfigureServices(IServiceCollection services)
		{
			//Register DI
			DIRegister(services, Configuration);

			//Configure Identity
			IdentityConfiguration(services, Configuration);

			//Configure Authentication
			AuthConfiguration(services, Configuration);

			services.AddMvc()
				.AddViewLocalization(LanguageViewLocationExpanderFormat.Suffix)
				.AddDataAnnotationsLocalization()
				.AddJsonOptions(opt =>
				{
					opt.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
					opt.SerializerSettings.ContractResolver = new DefaultContractResolver()
					{
						NamingStrategy = new SnakeCaseNamingStrategy(),
					};
					opt.SerializerSettings.Converters.Add(new StringEnumConverter());
				})
				.SetCompatibilityVersion(CompatibilityVersion.Version_2_2);

			services.AddLocalization(options => options.ResourcesPath = "Resources");
		}

		public void Configure(IApplicationBuilder app, IHostingEnvironment env)
		{
			//InitializeDatabase(app);

			if (env.IsDevelopment())
			{
				app.UseDeveloperExceptionPage();
				app.UseDatabaseErrorPage();
			}
			else
			{
				app.UseExceptionHandler("/Home/Error");
			}

			var forwardHeaders = Configuration.GetValue("AppSettings:ForwardHeaders", string.Empty);			
			if (!string.IsNullOrEmpty(forwardHeaders) && bool.Parse(forwardHeaders))
			{
				var fordwardedHeaderOptions = new ForwardedHeadersOptions
				{
					ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
				};

				fordwardedHeaderOptions.KnownNetworks.Clear();
				fordwardedHeaderOptions.KnownProxies.Clear();

				app.UseForwardedHeaders(fordwardedHeaderOptions);
			}

			var httpsRedirection = Configuration.GetValue("AppSettings:HttpsRedirection", string.Empty);
			if (!string.IsNullOrEmpty(httpsRedirection) && bool.Parse(httpsRedirection))
			{
				app.UseHsts().UseHttpsRedirection();
			}
			var supportedCultures = new[]
			{
				new CultureInfo("tr"),
				new CultureInfo("tr-TR"),
				new CultureInfo("en"),
				new CultureInfo("en-US")
			};

			app.UseRequestLocalization(new RequestLocalizationOptions
			{
				DefaultRequestCulture = new RequestCulture("en"),
				SupportedCultures = supportedCultures,
				SupportedUICultures = supportedCultures
			});

			app.Use(async (ctx, next) =>
			{
				if (!string.IsNullOrEmpty(httpsRedirection) && bool.Parse(httpsRedirection))
					ctx.Request.Scheme = "https";
				else
					ctx.Request.Scheme = "http";

				ctx.Response.Headers.Add("Content-Security-Policy", "default-src 'self' * 'unsafe-inline' 'unsafe-eval' data:");
				await next();
			});

			app.UseStaticFiles();
			app.UseIdentityServer();
			app.UseMvcWithDefaultRoute();
		}
	}
}