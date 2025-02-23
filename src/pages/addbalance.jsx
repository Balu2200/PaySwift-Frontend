import Headingtitle from "../components/Headingtitle";
import { Button } from "../components/Button";
import InputBox from "../components/InputBox";
import { useState } from "react";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddBalance = () => {
  const [amount, setAmount] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [step, setStep] = useState(1);
  const [pin, setPin] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleNextStep = () => {
    const transferAmount = Number(amount);

    if (!amount || isNaN(transferAmount) || transferAmount <= 0) {
      setStatusMessage("Please enter a valid amount greater than 0.");
      setIsError(true);
      return;
    }

    setStep(2);
    setStatusMessage("");
  };

  const handleAddBalance = async () => {
    if (!/^\d{4,6}$/.test(pin)) {
      setStatusMessage("Invalid PIN. Must be 4-6 digits.");
      setIsError(true);
      return;
    }

    try {
      const response = await axios.put(
        `${BASE_URL}/account/update`,
        { amount: Number(amount), pin },
        { withCredentials: true }
      );

      setStatusMessage("Balance updated successfully!");
      setIsError(false);
      setAmount("");
      setPin("");
      setStep(1);
    } catch (err) {
      console.error("Balance update failed:", err);

      setStatusMessage(
        err.response?.data?.error || "Balance not updated! Please try again."
      );
      setIsError(true);
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-200 to-blue-500 h-screen flex justify-center items-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-xl bg-white w-96 text-center p-8 h-max shadow-2xl">
          <Headingtitle label={"Add Balance"} />

          <div className="gap-3 pt-2 mb-3">
            {step === 1 && (
              <>
                <div>
                  <InputBox
                    placeholder="Enter amount"
                    label="Amount (in Rs.)"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div className="pb-4">
                  <Button
                    onClick={handleNextStep}
                    label="Next"
                    className="bg-gradient-to-r from-green-500 to-emerald-700 hover:from-green-600 hover:to-emerald-800 text-white font-medium py-2 px-4 rounded transition-all"
                  />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <InputBox
                    placeholder="Enter your PIN"
                    label="Enter your PIN"
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                  />
                </div>
                <div className="pb-4">
                  <Button
                    onClick={handleAddBalance}
                    label="Confirm"
                    className="bg-gradient-to-r from-blue-500 to-indigo-700 hover:from-blue-600 hover:to-indigo-800 text-white font-medium py-2 px-4 rounded transition-all"
                  />
                </div>
              </>
            )}

            {statusMessage && (
              <div className={isError ? "text-red-500" : "text-green-500"}>
                {statusMessage}
              </div>
            )}

            <div className="pt-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="text-indigo-500 underline font-semibold"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBalance;
