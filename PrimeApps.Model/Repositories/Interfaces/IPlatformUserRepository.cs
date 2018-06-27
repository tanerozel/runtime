﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PrimeApps.Model.Common.Instance;
using PrimeApps.Model.Entities.Platform;
using PrimeApps.Model.Enums;

namespace PrimeApps.Model.Repositories.Interfaces
{
    public interface IPlatformUserRepository : IRepositoryBasePlatform
    {
        Task<PlatformUser> Get(int platformUserId);
        Task<PlatformUser> GetSettings(int platformUserId);
        Task<PlatformUser> Get(string email);
		Task<PlatformUser> GetWithTenants(string email);
		Task<int> CreateUser(PlatformUser user);

		Task UpdateAsync(PlatformUser userToEdit);
        Task<PlatformUser> GetUserByAutoId(int tenantID);
		Task<EmailAvailableType> IsEmailAvailable(string email, int appId);
		Task<Tenant> GetTenantWithOwner(int tenantId);

		Task<bool> IsActiveDirectoryEmailAvailable(string email);
        Task<int> GetIdByEmail(string email);
        Task<List<PlatformUser>> GetAllByTenant(int tenantId);
		//TODO Removed
        //Task<ActiveDirectoryTenant> GetConfirmedActiveDirectoryTenant(int tenantId);
        //Task<PlatformUser> GetUserByActiveDirectoryTenantEmail(string email);
        Task<string> GetEmail(int userId);
        Task<IList<Workgroup>> MyWorkgroups(int globalId);
        PlatformUser GetByEmailAndTenantId(string email, int tenantId);
        Tenant GetTenantByEmailAndAppId(string email, int appId);
	}
}
