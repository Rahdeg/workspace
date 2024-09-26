import { InputOTP, InputOTPGroup, InputOTPSlot } from "./input-otp";


export function CodeInput({ length = 8 }: { length?: number }) {
    return (
        <div className="mb-4">
            <InputOTP maxLength={8} name="code" id="code" className="">
                <InputOTPGroup>
                    {Array(length)
                        .fill(null)
                        .map((_, index) => (
                            <InputOTPSlot key={index} index={index} className="" />
                        ))}
                </InputOTPGroup>
            </InputOTP>
        </div>
    );
}