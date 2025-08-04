package app

import (
	"fmt"
	"strings"

	"github.com/TrueBlocks/trueblocks-ballad/pkg/msgs"
	"github.com/TrueBlocks/trueblocks-ballad/pkg/project"
	"github.com/TrueBlocks/trueblocks-ballad/pkg/types"
)

// GetLastView returns the last visited view/route in the active project.
func (a *App) GetLastView() string {
	if active := a.GetActiveProject(); active != nil {
		return active.GetLastView()
	}
	return ""
}

// SetLastView sets the last visited view/route in the active project
func (a *App) SetLastView(view string) (string, error) {
	if active := a.GetActiveProject(); active != nil {
		cleanView := strings.Trim(view, "/")
		err := active.SetLastView(view)
		return cleanView, err
	}
	return "", fmt.Errorf("no active project")
}

// SetLastFacet sets the last visited facet for a specific view in the active project
func (a *App) SetLastFacet(view, facet string) (string, error) {
	if active := a.GetActiveProject(); active != nil {
		cleanView := strings.Trim(view, "/")
		err := active.SetLastFacet(view, facet)
		return cleanView, err
	}
	return "", fmt.Errorf("no active project")
}

// SetViewAndFacet atomically sets both the last view and facet in a single operation
func (a *App) SetViewAndFacet(view, facet string) (string, error) {
	if active := a.GetActiveProject(); active != nil {
		cleanView := strings.Trim(view, "/")
		err := active.SetViewAndFacet(view, facet)
		return cleanView, err
	}
	return "", fmt.Errorf("no active project")
}

// GetLastFacet returns the last visited facet for a specific view from the active project
func (a *App) GetLastFacet(view string) string {
	if active := a.GetActiveProject(); active != nil {
		return active.GetLastFacet(view)
	}
	return ""
}

// GetFilterState retrieves view state for a given key from the active project
func (a *App) GetFilterState(key project.ViewStateKey) (project.FilterState, error) {
	if active := a.GetActiveProject(); active != nil {
		if state, exists := active.GetFilterState(key); exists {
			return state, nil
		}
	}
	return project.FilterState{}, fmt.Errorf("no active project")
}

// SetFilterState sets view state for a given key in the active project
func (a *App) SetFilterState(key project.ViewStateKey, state project.FilterState) error {
	if active := a.GetActiveProject(); active != nil {
		return active.SetFilterState(key, state)
	}
	return fmt.Errorf("no active project")
}

// ClearFilterState removes filter state for a given key from the active project
func (a *App) ClearFilterState(key project.ViewStateKey) error {
	if active := a.GetActiveProject(); active != nil {
		return active.ClearFilterState(key)
	}
	return fmt.Errorf("no active project")
}

// GetWizardReturn returns the last view without the "wizard" suffix
func (a *App) GetWizardReturn() string {
	return strings.Replace(a.GetLastView(), "wizard", "", -1)
}

// GetProjectViewState retrieves all filter states for a given view name from the active project
func (a *App) GetProjectViewState(viewName string) (map[string]project.FilterState, error) {
	if active := a.GetActiveProject(); active != nil {
		result := make(map[string]project.FilterState)
		for key, state := range active.FilterStates {
			if key.ViewName == viewName {
				result[string(key.FacetName)] = state
			}
		}
		return result, nil
	}
	return nil, fmt.Errorf("no active project")
}

// SetProjectViewState sets all filter states for a given view name in the active project
func (a *App) SetProjectViewState(viewName string, states map[string]project.FilterState) error {
	if active := a.GetActiveProject(); active != nil {
		for key := range active.FilterStates {
			if key.ViewName == viewName {
				if err := active.ClearFilterState(key); err != nil {
					return err
				}
			}
		}

		for facetName, state := range states {
			key := project.ViewStateKey{
				ViewName:  viewName,
				FacetName: types.DataFacet(facetName),
			}
			if err := active.SetFilterState(key, state); err != nil {
				return err
			}
		}

		return nil
	}

	return fmt.Errorf("no active project")
}

// SetActiveChain sets the active chain in the active project
func (a *App) SetActiveChain(chain string) error {
	if active := a.GetActiveProject(); active != nil {
		err := active.SetActiveChain(chain)
		if err == nil {
			msgs.EmitManager("active_chain_changed")
		}
		return err
	}
	return fmt.Errorf("no active project")
}
