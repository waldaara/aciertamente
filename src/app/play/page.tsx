"use client";

import { useEffect, useRef, useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";
import { toast } from "sonner";
import { sendData } from "@/actions/sendData";
import { useRouter } from "next/navigation";

const SHOW_NUMBER_SEQUENCE_DURATION = 10;
const SHOW_NEXT_NUMBER_SEQUENCE_DURATION = 3;

export default function Play() {
  const { width, height } = useWindowSize();
  const [startCount, setStartCount] = useState(1);
  const [numberSequences, setNumberSequences] = useState<string[]>([]);
  const [numberSequence, setNumberSequence] = useState("");
  const [numberSequenceIndex, setNumberSequenceIndex] = useState(0);
  const [timer, setTimer] = useState(SHOW_NUMBER_SEQUENCE_DURATION);
  const [showNumberSequence, setShowNumberSequence] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [loading, setLoading] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  useEffect(() => {
    const numberSequences: string[] = [];

    for (let i = 0; i < 5; i++) {
      let numberSequence = "";

      for (let j = 0; j < 5; j++) {
        const randomNumber = Math.floor(Math.random() * (99 - 10 + 1) + 10);

        numberSequence += randomNumber;
      }

      numberSequences.push(numberSequence);
    }

    setNumberSequences(numberSequences);

    setStartTime(Date.now());
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (startCount > SHOW_NEXT_NUMBER_SEQUENCE_DURATION)
        return clearInterval(interval);

      setStartCount((startCount) => startCount + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [startCount]);

  useEffect(() => {
    if (startCount > SHOW_NEXT_NUMBER_SEQUENCE_DURATION) {
      setShowNumberSequence(true);

      const interval = setInterval(() => {
        if (timer < 1) {
          setShowNumberSequence(false);

          return clearInterval(interval);
        }

        setTimer((timer) => timer - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [numberSequences.length, startCount, timer]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 relative">
      {showConfetti && <Confetti width={width} height={height} />}

      {startCount <= SHOW_NEXT_NUMBER_SEQUENCE_DURATION && (
        <h1 className="text-7xl font-bold">{startCount}</h1>
      )}

      {showNumberSequence && (
        <span className="absolute top-10 right-10 font-bold bg-primary text-xl rounded-full w-10 aspect-square flex place-content-center flex-wrap">
          {timer}
        </span>
      )}

      {startCount > SHOW_NEXT_NUMBER_SEQUENCE_DURATION && (
        <>
          <span className="font-bold text-xl absolute left-10 top-10">
            {numberSequenceIndex + 1} / {numberSequences.length}
          </span>

          <span className="font-bold text-2xl absolute mx-auto bottom-20 bg-primary p-2 rounded-md">
            {correctCount} points
          </span>

          <InputOTP
            maxLength={10}
            value={
              showNumberSequence
                ? numberSequences[numberSequenceIndex]
                : numberSequence
            }
            onChange={setNumberSequence}
            disabled={showNumberSequence}
            onComplete={() => {
              if (numberSequence) {
                if (numberSequence === numberSequences[numberSequenceIndex]) {
                  setCorrectCount((correctCount) => correctCount + 1);

                  toast.success("Correct!");
                  setShowConfetti(true);

                  setTimeout(() => setShowConfetti(false), 3000);
                } else {
                  toast.error("Incorrect!");
                }

                if (numberSequenceIndex < numberSequences.length - 1) {
                  setNumberSequenceIndex((numberSequenceIndex) =>
                    Math.min(
                      numberSequenceIndex + 1,
                      numberSequences.length - 1
                    )
                  );

                  setStartCount(1);
                  setTimer(SHOW_NUMBER_SEQUENCE_DURATION);
                  setNumberSequence("");
                } else {
                  setIsGameOver(true);
                  setEndTime(Date.now());
                }
              }
            }}
          >
            <InputOTPGroup>
              <InputOTPSlot
                index={0}
                className="w-[8vw] h-[8vw] text-xl sm:text-3xl"
              />
              <InputOTPSlot
                index={1}
                className="w-[8vw] h-[8vw] text-xl sm:text-3xl"
              />
            </InputOTPGroup>

            <InputOTPGroup>
              <InputOTPSlot
                index={2}
                className="w-[8vw] h-[8vw] text-xl sm:text-3xl"
              />
              <InputOTPSlot
                index={3}
                className="w-[8vw] h-[8vw] text-xl sm:text-3xl"
              />
            </InputOTPGroup>

            <InputOTPGroup>
              <InputOTPSlot
                index={4}
                className="w-[8vw] h-[8vw] text-xl sm:text-3xl"
              />
              <InputOTPSlot
                index={5}
                className="w-[8vw] h-[8vw] text-xl sm:text-3xl"
              />
            </InputOTPGroup>

            <InputOTPGroup>
              <InputOTPSlot
                index={6}
                className="w-[8vw] h-[8vw] text-xl sm:text-3xl"
              />
              <InputOTPSlot
                index={7}
                className="w-[8vw] h-[8vw] text-xl sm:text-3xl"
              />
            </InputOTPGroup>

            <InputOTPGroup>
              <InputOTPSlot
                index={8}
                className="w-[8vw] h-[8vw] text-xl sm:text-3xl"
              />
              <InputOTPSlot
                index={9}
                className="w-[8vw] h-[8vw] text-xl sm:text-3xl"
              />
            </InputOTPGroup>
          </InputOTP>
        </>
      )}

      <Dialog open={isGameOver}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>You got {correctCount} points!</DialogTitle>
          </DialogHeader>
          <form ref={formRef} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sex" className="text-right">
                Sex
              </Label>
              <Select name="sex" required>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select the person's sex" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="age" className="text-right">
                Age
              </Label>
              <Input
                name="age"
                id="age"
                required
                min={15}
                max={90}
                type="number"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="decibels" className="text-right">
                Decibels
              </Label>
              <Input
                name="decibels"
                id="decibels"
                required
                min={0}
                max={100}
                type="number"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="points" className="text-right">
                Points
              </Label>
              <Input
                required
                id="points"
                name="points"
                value={correctCount}
                min={0}
                max={5}
                type="number"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">
                Duration
              </Label>
              <Input
                required
                id="duration"
                name="duration"
                value={((endTime - startTime) / 1000).toFixed(2)}
                step="0.01"
                min={1}
                type="number"
                className="col-span-3"
              />
            </div>
          </form>
          <DialogFooter>
            <Button
              disabled={loading}
              type="submit"
              onClick={async () => {
                if (formRef.current) {
                  if (!formRef.current.reportValidity()) return;

                  setLoading(true);
                  await sendData(new FormData(formRef.current));
                  setLoading(false);
                }

                router.push("/");
              }}
            >
              {!loading ? "Save" : "Saving..."}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
