import { useState } from "react";
import { Button, Input, Modal } from "antd";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";
import "./styles.scss";

interface StrategyFiltersProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
  searchText: string;
  onSearchChange: (text: string) => void;
}

const filterButtons = [
  { key: "all", label: "All Strategies" },
  { key: "long-calls", label: "Long Calls" },
  { key: "short-puts", label: "Short Puts" },
  { key: "iron-condors", label: "Iron Condors" },
  { key: "covered-calls", label: "Covered Calls" },
  { key: "bull-spreads", label: "Bull Spreads" },
] as const;

export function StrategyFilters({
  selectedFilter,
  onFilterChange,
  searchText,
  onSearchChange,
}: StrategyFiltersProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => setIsModalVisible(true);
  const hideModal = () => setIsModalVisible(false);

  return (
    <div className="strategy-filters">
      <div className="strategy-filters__container">
        {/* Desktop view */}
        <div className="strategy-filters__desktop">
          <div className="strategy-filters__buttons">
            {filterButtons.map((filter) => (
              <Button
                key={filter.key}
                type={selectedFilter === filter.key ? "primary" : "default"}
                onClick={() => onFilterChange(filter.key)}
                className="strategy-filters__button"
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Mobile view */}
        <div className="strategy-filters__mobile">
          <Button
            icon={<FilterOutlined />}
            onClick={showModal}
            className="strategy-filters__mobile-button"
          >
            Filters
          </Button>
        </div>

        <Input
          placeholder="Search strategies..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => onSearchChange(e.target.value)}
          className="strategy-filters__search"
          allowClear
        />
      </div>

      {/* Filter Modal for Mobile */}
      <Modal
        title="Strategy Filters"
        open={isModalVisible}
        onCancel={hideModal}
        footer={null}
        className="strategy-filters__modal"
      >
        <div className="strategy-filters__modal-content">
          {filterButtons.map((filter) => (
            <Button
              key={filter.key}
              type={selectedFilter === filter.key ? "primary" : "default"}
              onClick={() => {
                onFilterChange(filter.key);
                hideModal();
              }}
              className="strategy-filters__modal-button"
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </Modal>
    </div>
  );
}
