// Package rpc provides utilities for RPC availability and status checking
package rpc

import (
	"fmt"

	"github.com/TrueBlocks/trueblocks-ballad/pkg/preferences"
	"github.com/TrueBlocks/trueblocks-ballad/pkg/validation"
)

func CheckRpc() error {
	// TODO: FIX THIS
	// _, err := CheckRPCStatus()
	// if err != nil {
	// 	logging.LogBackend(fmt.Sprintf("RPC unavailable: %v", err))
	// 	return fmt.Errorf("RPC unavailable: %w", err)
	// }
	return nil
}

func CheckRPCStatus() (string, error) {
	var lastErr error = fmt.Errorf("no RPCs configured")
	if userPrefs, err := preferences.GetUserPreferences(); err != nil {
		return "", fmt.Errorf("failed to get user preferences: %w", err)
	} else {
		for _, chain := range userPrefs.Chains {
			for _, rpc := range chain.RpcProviders {
				if err := validation.ValidRPC(rpc); err == nil {
					return rpc, nil
				} else {
					lastErr = err
				}
			}
		}
	}

	return "", lastErr
}
