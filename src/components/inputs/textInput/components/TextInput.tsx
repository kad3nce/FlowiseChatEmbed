import { ShortTextInput } from "./ShortTextInput";
import { SendButton } from "@/components/SendButton";
import { isMobile } from "@/utils/isMobileSignal";
import { createSignal, onMount } from "solid-js";

type Props = {
  placeholder?: string;
  backgroundColor?: string;
  textColor?: string;
  sendButtonColor?: string;
  defaultValue?: string;
  fontSize?: number;
  onSubmit: (value: string) => void;
};

const defaultBackgroundColor = "#ffffff";
const defaultTextColor = "#303235";

export const TextInput = (props: Props) => {
  const [inputValue, setInputValue] = createSignal(props.defaultValue ?? "");
  let inputRef: HTMLInputElement | HTMLTextAreaElement | undefined;

  const handleInput = (inputValue: string) => setInputValue(inputValue);

  const checkIfInputIsValid = () =>
    inputValue() !== "" && inputRef?.reportValidity();

  const submit = () => {
    if (checkIfInputIsValid()) props.onSubmit(inputValue());
    setInputValue("");
  };

  const submitWhenEnter = (e: KeyboardEvent) => {
    // Check if IME composition is in progress
    const isIMEComposition = e.isComposing || e.keyCode === 229;
    if (e.key === "Enter" && !isIMEComposition) submit();
  };

  onMount(() => {
    if (!isMobile() && inputRef) inputRef.focus();
  });

  return (
    <div
      class={"flex items-end justify-between chatbot-input"}
      data-testid="input"
      style={{
        "border-top": "1px solid #eeeeee",
        position: "absolute",
        left: "8px",
        right: "8px",
        bottom: "8px",
        margin: "auto",
        "z-index": 1000,
        "background-color": props.backgroundColor ?? defaultBackgroundColor,
        color: props.textColor ?? defaultTextColor,
        "border-radius": "8px",
        "align-items": "center",
      }}
      onKeyDown={submitWhenEnter}
    >
      <ShortTextInput
        ref={inputRef as HTMLInputElement}
        onInput={handleInput}
        value={inputValue()}
        fontSize={props.fontSize}
        placeholder={props.placeholder ?? "Type your question"}
      />
      <SendButton
        sendButtonColor={props.sendButtonColor}
        type="button"
        isDisabled={inputValue() === ""}
        class="ml-2"
        on:click={submit}
      >
        <span>Send</span>
      </SendButton>
    </div>
  );
};
