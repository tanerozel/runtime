using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Configuration;
using PrimeApps.Model.Common;
using PrimeApps.Model.Common.Profile;
using PrimeApps.Model.Enums;
using PrimeApps.Model.Helpers;
using PrimeApps.Model.Repositories.Interfaces;
using PrimeApps.Studio.Helpers;

namespace PrimeApps.Studio.Controllers
{
	[Route("api/profile")]
	public class ProfileController : DraftBaseController
	{
		private IRelationRepository _relationRepository;
        private IUserRepository _userRepository;
        private IProfileRepository _profileRepository;
		private ISettingRepository _settingRepository;
		private IModuleRepository _moduleRepository;
		private IConfiguration _configuration;
		private Warehouse _warehouse;
		private IModuleHelper _moduleHelper;

		public ProfileController(IRelationRepository relationRepository, IProfileRepository profileRepository, ISettingRepository settingRepository, IModuleRepository moduleRepository, Warehouse warehouse, IModuleHelper moduleHelper, IConfiguration configuration,IHelpRepository helpRepository,IUserRepository userRepository)
		{
			_relationRepository = relationRepository;
			_profileRepository = profileRepository;
			_settingRepository = settingRepository;			
			_warehouse = warehouse;
			_configuration = configuration;
			_moduleHelper = moduleHelper;
            _userRepository = userRepository;
        }

		public override void OnActionExecuting(ActionExecutingContext context)
		{
			SetContext(context);
			SetCurrentUser(_relationRepository, PreviewMode, AppId, TenantId);
			SetCurrentUser(_profileRepository, PreviewMode, AppId, TenantId);
			SetCurrentUser(_settingRepository, PreviewMode, AppId, TenantId);

			base.OnActionExecuting(context);
		}

        /// <summary>
        /// Creates a new profile.
        /// </summary>
        /// <param name="NewProfile"></param>
        [Route("create"), HttpPost]
        public async Task<IActionResult> Create([FromBody]ProfileDTO NewProfile)
        {
            //Set Warehouse
            _warehouse.DatabaseName = AppUser.WarehouseDatabaseName;

           var profile = await _profileRepository.CreateAsync(NewProfile, AppUser.TenantLanguage);

		  return Ok(profile);
        }

        /// <summary>
        /// Updates an existing profile.
        /// </summary>
        /// <param name="UpdatedProfile"></param>
        [Route("update"), HttpPost]
        public async Task<IActionResult> Update([FromBody]ProfileDTO UpdatedProfile)
        {
            //Set Warehouse
            _warehouse.DatabaseName = AppUser.WarehouseDatabaseName;

            await _profileRepository.UpdateAsync(UpdatedProfile, AppUser.TenantLanguage);
            return Ok();
        }

        /// <summary>
        /// Removes a profile and replaces its relations with another profile.
        /// </summary>
        /// <param name="RemovalRequest"></param>
        [Route("remove"), HttpPost]
        public async Task<IActionResult> Remove([FromBody]ProfileRemovalDTO RemovalRequest)
        {
            await _profileRepository.RemoveAsync(RemovalRequest.RemovedProfile.ID, RemovalRequest.TransferProfile.ID);


            return Ok();
        }

        /// <summary>
        /// Gets all profiles and permissions belong to users workgroups with a lightweight user id list.
        /// </summary>
        /// <returns></returns>
        [Route("get_all"), HttpPost]
        public async Task<IActionResult> GetAll()
        {
            IEnumerable<ProfileWithUsersDTO> profileList = await _profileRepository.GetAllProfiles();

            return Ok(profileList);
        }

        /// <summary>
        /// Changes users profile with another one.
        /// </summary>
        /// <param name="transfer"></param>
        [Route("change_user_profile"), HttpPost]
        public async Task<IActionResult> ChangeUserProfile([FromBody]ProfileTransferDTO transfer)
        {
            await _profileRepository.AddUserAsync(transfer.UserID, transfer.TransferedProfileID);
            /// update session cache

            return Ok();
        }

        [Route("get_all_basic"), HttpGet]
        public async Task<IActionResult> GetAllBasic()
        {
            var profiles = await _profileRepository.GetAll();

            return Ok(profiles);
        }

        [Route("delete/{id:int}"), HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            var profileEntity = await _profileRepository.GetByIdBasic(id);

            if (profileEntity == null)
                return NotFound();

            await _profileRepository.DeleteSoft(profileEntity);

            return Ok();
        }

        [Route("count"), HttpGet]
        public async Task<IActionResult> Count([FromUri]TemplateType templateType)
        {
            var count = await _profileRepository.Count();

            //if (count < 1)
            //	return NotFound(count);

            return Ok(count);
        }

        [Route("find"), HttpPost]
        public async Task<IActionResult> Find([FromBody]PaginationModel paginationModel)
        {
            var templates = await _profileRepository.Find(paginationModel);

            //if (templates == null)
            //	return NotFound();

            return Ok(templates);
        }

    }
}
