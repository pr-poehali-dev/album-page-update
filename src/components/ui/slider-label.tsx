
import { Slider } from "@/components/ui/slider";

interface SliderLabelProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  label: string;
  valueDisplay?: string;
}

const SliderLabel = ({
  value,
  onChange,
  min,
  max,
  step = 1,
  label,
  valueDisplay,
}: SliderLabelProps) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium">{label}</label>
        <span className="text-sm text-gray-500">{valueDisplay || value}</span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(values) => onChange(values[0])}
      />
    </div>
  );
};

export default SliderLabel;
