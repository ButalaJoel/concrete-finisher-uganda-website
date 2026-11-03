import {
  Building2, Car, Factory, GraduationCap, Home, Hospital, ShoppingBag, Warehouse,
} from "lucide-react";

const INDUSTRIES = [
  { icon: Warehouse, label: "Warehouses" },
  { icon: Factory, label: "Factories" },
  { icon: Hospital, label: "Hospitals" },
  { icon: GraduationCap, label: "Schools" },
  { icon: ShoppingBag, label: "Retail stores" },
  { icon: Building2, label: "Office buildings" },
  { icon: Home, label: "Homes" },
  { icon: Car, label: "Parking facilities" },
];

function IndustriesSection() {
  return (
    <div className="section section--tint">
      <div className="wrap">
        <div className="section-head">
          <h2 className="h2">Who we work for</h2>
        </div>
        <ul className="industries">
          {INDUSTRIES.map(({ icon: Icon, label }) => (
            <li key={label}>
              <Icon size={22} strokeWidth={1.6} aria-hidden="true" />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default IndustriesSection;
