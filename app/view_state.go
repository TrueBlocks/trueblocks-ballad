package app

import (
	"fmt"
	"strings"

	"github.com/TrueBlocks/trueblocks-ballad/pkg/msgs"
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
