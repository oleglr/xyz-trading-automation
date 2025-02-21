import { useState } from "react";
import { Row, Col, Card, Tag, Button } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { StrategyFilters } from "../StrategyFilters";
import { StrategyDrawer } from "../StrategyDrawer";
import "./styles.scss";

interface Strategy {
  id: string;
  title: string;
  description: string;
  risk: "low" | "medium" | "high";
  profit: "limited" | "unlimited";
  category:
    | "all"
    | "long-calls"
    | "short-puts"
    | "iron-condors"
    | "covered-calls"
    | "bull-spreads";
  isAvailable?: boolean;
}

const strategies: Strategy[] = [
  {
    id: "repeat-trade",
    title: "Repeat Trade",
    description: "Buy weekly call options on oversold stocks with high volume",
    risk: "medium",
    profit: "unlimited",
    category: "long-calls",
    isAvailable: true,
  },
  {
    id: "threshold-trade",
    title: "Threshold Trade",
    description: "Sell puts on blue-chip stocks during market dips",
    risk: "medium",
    profit: "limited",
    category: "short-puts",
    isAvailable: true,
  },
  {
    id: "martingale-trade",
    title: "Martingale Trade",
    description: "Sell monthly iron condors on low volatility ETFs",
    risk: "low",
    profit: "limited",
    category: "iron-condors",
    isAvailable: true,
  },
  {
    id: "covered-call-income",
    title: "Covered Call Income",
    description:
      "Generate monthly income by selling covered calls on dividend stocks",
    risk: "low",
    profit: "limited",
    category: "covered-calls",
    isAvailable: false,
  },
  {
    id: "bull-call-spread",
    title: "Bull Call Spread",
    description:
      "Buy and sell calls at different strikes for a bullish outlook with defined risk",
    risk: "medium",
    profit: "limited",
    category: "bull-spreads",
    isAvailable: false,
  },
  {
    id: "momentum-call-buyer",
    title: "Momentum Call Buyer",
    description:
      "Buy calls on stocks showing strong upward momentum and high relative strength",
    risk: "high",
    profit: "unlimited",
    category: "long-calls",
    isAvailable: false,
  },
];

export function StrategyList() {
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(
    null
  );
  const [selectedFilter, setSelectedFilter] =
    useState<Strategy["category"]>("all");
  const [searchText, setSearchText] = useState("");

  const handleCreateStrategy = (strategy: Strategy) => {
    setSelectedStrategy(strategy);
  };

  const handleCloseDrawer = () => {
    setSelectedStrategy(null);
  };

  interface FormValues {
    number_of_trades?: number;
    proposal?: number;
    amount?: number;
    basis?: string;
    contract_type?: string;
    currency?: string;
    symbol?: string;
    growth_rate?: number;
    limit_order?: {
      take_profit: number;
    };
  }

  const handleSubmitForm = (values: FormValues) => {
    console.log("Strategy values:", values);
    setSelectedStrategy(null);
  };

  const filteredStrategies = strategies.filter((strategy) => {
    const matchesFilter =
      selectedFilter === "all" || strategy.category === selectedFilter;
    const matchesSearch =
      !searchText ||
      strategy.title.toLowerCase().includes(searchText.toLowerCase()) ||
      strategy.description.toLowerCase().includes(searchText.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="strategy-list-container">
      <div className="strategy-list-header">
        <StrategyFilters
          selectedFilter={selectedFilter}
          onFilterChange={(filter) =>
            setSelectedFilter(filter as Strategy["category"])
          }
          searchText={searchText}
          onSearchChange={setSearchText}
        />
      </div>
      <div className="strategy-list">
        <div className="strategy-list__content">
          <Row gutter={[24, 24]}>
            {filteredStrategies.map((strategy) => (
              <Col xs={24} sm={24} md={12} lg={8} key={strategy.id}>
                <Card className="strategy-list__card">
                  <div className="strategy-list__card-content">
                    <div className="strategy-list__card-body">
                      <h3 className="strategy-list__card-title">
                        {strategy.title}
                      </h3>
                      <p className="strategy-list__card-description">
                        {strategy.description}
                      </p>
                      <div className="strategy-list__tags">
                        <Tag className={`risk--${strategy.risk}`}>
                          Risk: {strategy.risk}
                        </Tag>
                        <Tag className={`profit--${strategy.profit}`}>
                          Profit: {strategy.profit}
                        </Tag>
                      </div>
                    </div>
                    <div className="strategy-list__card-footer">
                      {strategy.isAvailable ? (
                        <Button
                          type="link"
                          onClick={() => handleCreateStrategy(strategy)}
                        >
                          Create Strategy <RightOutlined />
                        </Button>
                      ) : (
                        <Button type="link" disabled>
                          Coming Soon
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        <StrategyDrawer 
          strategy={selectedStrategy}
          onClose={handleCloseDrawer}
          onSubmit={handleSubmitForm}
        />
      </div>
    </div>
  );
}
