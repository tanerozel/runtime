using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using PrimeApps.Console.ActionFilters;
using PrimeApps.Console.Models;
using PrimeApps.Model.Enums;
using PrimeApps.Model.Entities.Tenant;
using PrimeApps.Model.Repositories.Interfaces;
using HttpStatusCode = Microsoft.AspNetCore.Http.StatusCodes;
using PrimeApps.Console.Helpers;
using PrimeApps.Model.Common;

namespace PrimeApps.Console.Controllers
{
	[Route("api/view"), Authorize]
	public class ViewController : DraftBaseController
	{
		private IViewRepository _viewRepository;
		private IUserRepository _userRepository;
		private IDashboardRepository _dashboardRepository;
		private IRecordHelper _recordHelper;

		public ViewController(IViewRepository viewRepository, IUserRepository userRepository, IDashboardRepository dashboardRepository, IRecordHelper recordHelper)
		{
			_viewRepository = viewRepository;
			_userRepository = userRepository;
			_dashboardRepository = dashboardRepository;
			_recordHelper = recordHelper;
		}

		public override void OnActionExecuting(ActionExecutingContext context)
		{
			SetContext(context);
			SetCurrentUser(_userRepository, PreviewMode, TenantId, AppId);
			SetCurrentUser(_viewRepository, PreviewMode, TenantId, AppId);
			SetCurrentUser(_dashboardRepository, PreviewMode, TenantId, AppId);

			base.OnActionExecuting(context);
		}

		[Route("get/{id:int}"), HttpGet]
		public async Task<IActionResult> Get(int id)
		{
			var viewEntity = await _viewRepository.GetById(id);

			if (viewEntity == null)
				return NotFound();

			var viewViewModel = ViewHelper.MapToViewModel(viewEntity);

			return Ok(viewViewModel);
		}

		[Route("get_all/{moduleId:int}"), HttpGet]
		public async Task<IActionResult> GetAll(int moduleId)
		{
			if (moduleId < 1)
				return BadRequest("Module id is required!");

			var viewEntities = await _viewRepository.GetAll(moduleId);
			var viewsViewModel = ViewHelper.MapToViewModel(viewEntities);

			return Ok(viewsViewModel);
		}

		[Route("get_all"), HttpGet]
		public async Task<IActionResult> GetAll()
		{
			var viewEntities = await _viewRepository.GetAll();
			var viewsViewModel = ViewHelper.MapToViewModel(viewEntities);

			return Ok(viewsViewModel);
		}

		[Route("create"), HttpPost]
		public async Task<IActionResult> Create([FromBody]ViewBindingModel view)
		{
			if (!_recordHelper.ValidateFilterLogic(view.FilterLogic, view.Filters))
				ModelState.AddModelError("request._filter_logic", "The field FilterLogic is invalid or has no filters.");

			if (!ModelState.IsValid)
				return BadRequest(ModelState);

			var viewEntity = await ViewHelper.CreateEntity(view, _userRepository);
			var result = await _viewRepository.Create(viewEntity);

			if (result < 1)
				throw new ApplicationException(HttpStatusCode.Status500InternalServerError.ToString());
			//throw new HttpResponseException(HttpStatusCode.Status500InternalServerError);

			var uri = new Uri(Request.GetDisplayUrl());
			return Created(uri.Scheme + "://" + uri.Authority + "/api/view/get/" + viewEntity.Id, viewEntity);
			//return Created(Request.Scheme + "://" + Request.Host + "/api/view/get/" + viewEntity.Id, viewEntity);
		}

		[Route("update/{id:int}"), HttpPut]
		public async Task<IActionResult> Update(int id, [FromBody]ViewBindingModel view)
		{
			var viewEntity = await _viewRepository.GetById(id);

			if (viewEntity == null)
				return NotFound();

			var currentFieldIds = viewEntity.Fields.Select(x => x.Id).ToList();
			var currentFilterIds = new List<int>();

			if (viewEntity.SystemType == SystemType.Custom)
				currentFilterIds = viewEntity.Filters.Select(x => x.Id).ToList();

			if (viewEntity.Shares != null && viewEntity.Shares.Count > 0)
			{
				var currentShares = viewEntity.Shares.ToList();

				foreach (ViewShares share in currentShares)
				{
					await _viewRepository.DeleteViewShare(share, share.User);
				}
			}

			await ViewHelper.UpdateEntity(view, viewEntity, _userRepository);
			await _viewRepository.Update(viewEntity, currentFieldIds, currentFilterIds);

			string name = AppUser.TenantLanguage == "tr" ? viewEntity.LabelTr : viewEntity.LabelEn;
			await _dashboardRepository.UpdateNameWidgetsByViewId(name, id);

			return Ok(viewEntity);
		}

		[Route("delete/{id:int}"), HttpDelete]
		public async Task<IActionResult> Delete(int id)
		{
			var viewEntity = await _viewRepository.GetById(id);

			if (viewEntity == null)
				return NotFound();

			await _viewRepository.DeleteSoft(viewEntity);
			await _dashboardRepository.DeleteSoftByViewId(id);

			return Ok();
		}

		[Route("get_view_state/{moduleId:int}"), HttpGet]
		public async Task<IActionResult> GetViewState(int moduleId)
		{
			if (moduleId < 1)
				return BadRequest("Module id is required!");

			var viewState = await _viewRepository.GetViewState(moduleId, AppUser.Id);

			return Ok(viewState);
		}

		[Route("set_view_state"), HttpPut]
		public async Task<IActionResult> SetViewState([FromBody] ViewStateBindingModel viewState)
		{
			var viewStateEntity = await _viewRepository.GetViewState(viewState.ModuleId, AppUser.Id);

			if (!viewState.Id.HasValue && viewStateEntity == null)
			{
				var viewStateCreateEntity = ViewHelper.CreateEntityViewState(viewState, AppUser.Id);
				var resultCreate = await _viewRepository.CreateViewState(viewStateCreateEntity);

				if (resultCreate < 1)
					throw new ApplicationException(HttpStatusCode.Status500InternalServerError.ToString());
				//throw new HttpResponseException(HttpStatusCode.Status500InternalServerError);

				var uri = new Uri(Request.GetDisplayUrl());
				return Created(uri.Scheme + "://" + uri.Authority + "/api/view/get_view_state/" + viewStateCreateEntity.ModuleId, viewStateCreateEntity);
				//return Created(Request.Scheme + "://" + Request.Host + "/api/view/get_view_state/" + viewStateCreateEntity.ModuleId, viewStateCreateEntity);
			}

			ViewHelper.UpdateEntityViewState(viewState, viewStateEntity);
			await _viewRepository.UpdateViewState(viewStateEntity);

			return Ok(viewStateEntity);
		}

		[Route("count"), HttpGet]
		public async Task<IActionResult> Count()
		{
			var count = await _viewRepository.Count();

			if (count < 1)
				return NotFound();

			return Ok(count);
		}

		[Route("find"), HttpPost]
		public async Task<IActionResult> Find([FromBody]PaginationModel paginationModel)
		{
			var views = await _viewRepository.Find(paginationModel);

			if (views == null)
				return NotFound();

			return Ok(views);
		}
	}
}