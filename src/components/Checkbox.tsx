import { CheckIcon, XMarkIcon } from "@heroicons/react/20/solid";

export const CheckboxState = {
  unchecked: "unchecked",
  checked: "checked",
  indeterminate: "indeterminate",
} as const;

export type TCheckboxState = (typeof CheckboxState)[keyof typeof CheckboxState];

type CheckboxProps = {
  label: string;
  onChange?: (state: TCheckboxState) => void;
  state: TCheckboxState;
};

const Checkbox = (props: CheckboxProps) => {
  const { label, state, onChange } = props;

  const toggleState = () => {
    let nextState: TCheckboxState = CheckboxState.unchecked;
    if (state === CheckboxState.unchecked) {
      nextState = CheckboxState.checked;
    } else if (state === CheckboxState.checked) {
      nextState = CheckboxState.indeterminate;
    } else {
      nextState = CheckboxState.unchecked;
    }

    onChange?.(nextState);
  };

  const bgClass = state === CheckboxState.checked ? "bg-blue-500" : state === CheckboxState.indeterminate ? "bg-red-400" : "";
  const borderClass =
    state === CheckboxState.checked ? "border-blue-500" : state === CheckboxState.indeterminate ? "border-red-400" : "border-black";

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <input
          type="checkbox"
          checked={state !== CheckboxState.unchecked}
          onChange={toggleState}
          className={`h-5 w-5 appearance-none border border-solid ${borderClass} ${bgClass}`}
        />
        {state === CheckboxState.checked && <CheckIcon className="pointer-events-none absolute inset-0 h-5 w-5 text-white" />}
        {state === CheckboxState.indeterminate && <XMarkIcon className="pointer-events-none absolute inset-0 h-5 w-5 text-white" />}
      </div>
      <label className="text-sm font-medium text-gray-900">{label}</label>
    </div>
  );
};

export default Checkbox;
