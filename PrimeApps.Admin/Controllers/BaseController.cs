using Microsoft.AspNetCore.Mvc;
using PrimeApps.Model.Common.Cache;
using PrimeApps.Model.Entities.Platform;
using PrimeApps.Model.Helpers;
using PrimeApps.Model.Repositories.Interfaces;

namespace PrimeApps.Admin.Controllers
{
    public class BaseController : Controller
    {
        private UserItem _appUser;
        public UserItem AppUser
        {
            get
            {
                if (_appUser == null && HttpContext.Items?["user"] != null)
                {
                    _appUser = GetUser();
                }

                return _appUser;
            }
        }
        
        public void SetCurrentUser(IRepositoryBasePlatform repository)
        {
            if (AppUser != null)
            {
                repository.CurrentUser = new CurrentUser { UserId = AppUser.Id };
            }
        }
        
        public PlatformUser SetContextUser()
        {
            var email = HttpContext.User.FindFirst("email")?.Value;
            var platformUserRepository = (IPlatformUserRepository)HttpContext.RequestServices.GetService(typeof(IPlatformUserRepository));

            platformUserRepository.CurrentUser = new CurrentUser { UserId = 1 };

            var platformUser = platformUserRepository.GetByEmail(email);

            HttpContext.Items.Add("user", platformUser);

            return platformUser;
        }
        
        private UserItem GetUser()
        {
            var platformUser = (PlatformUser)HttpContext.Items["user"];

            var appUser = new UserItem
            {
                Id = platformUser.Id,
                Email = platformUser.Email,
                FullName = platformUser.FirstName + " " + platformUser.LastName,
                Currency = platformUser.Setting?.Currency,
                Culture = platformUser.Setting?.Culture,
                Language = platformUser.Setting?.Language,
                TimeZone = platformUser.Setting?.TimeZone
            };

            return appUser;
        }
        
    }
}