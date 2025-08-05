import { getDebugClass } from '@utils';

interface DetailPanelProps<T extends Record<string, unknown>> {
  selectedRowData: T | null | undefined;
  detailPanel?: (rowData: T | null) => React.ReactNode;
}

export const DetailPanel = <T extends Record<string, unknown>>({
  selectedRowData,
  detailPanel,
}: DetailPanelProps<T>) => {
  return (
    <div className={`detail-panel ${getDebugClass(12)}`}>
      <div className="detail-panel-content">
        {selectedRowData && detailPanel ? (
          detailPanel(selectedRowData)
        ) : (
          <div className="detail-panel-placeholder">
            {selectedRowData ? (
              <div>
                <h4>Row Details</h4>
                <div className="detail-panel-default">
                  {Object.entries(selectedRowData).map(([key, value]) => (
                    <div key={key} className="detail-row">
                      <strong>{key}:</strong> {String(value)}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="no-selection">Select a row to view details</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
