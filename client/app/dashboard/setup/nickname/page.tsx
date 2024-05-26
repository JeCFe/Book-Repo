"use client";

import { AccordionManager, Checkbox } from "@/components";
import { SetupBook, SetupBookshelf, useSetupWizard } from "@/hooks";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Button, Info } from "@jecfe/react-design-system";
import { useRouter } from "next/navigation";
import { SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { SetupModal } from "../../SetupModal";

export type FormValues = {
  nickname: string;
};

export default function Nickname() {
  const { config, complete, nickname, updateCustomer } = useSetupWizard();
  const { user } = useUser();

  const router = useRouter();

  useEffect(() => {
    if (config === undefined) {
      router.push("/dashboard/setup");
    }
  }, []);

  const onSubmit = (data: FormValues) => {
    var updatedCustomer = updateCustomer({
      type: "set-nickanme",
      nickname: data.nickname,
    });
    if (complete(updatedCustomer) || config === "express") {
      router.push("/dashboard/setup/preview");
      return;
    }
    router.push("/dashboard/setup/bookshelves");
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { nickname: nickname ?? user?.nickname ?? "" },
  });

  return (
    <div className="flex flex-col">
      <SetupModal />

      <h1 className="flex flex-col text-5xl font-bold tracking-tight text-slate-200 md:text-8xl">
        Setup your nickname
      </h1>
      <div className="mt-4 flex max-w-sm flex-row text-xl font-bold tracking-tight text-slate-400 md:max-w-4xl md:text-3xl">
        What would you like to be called? This nickname can be changed later,
        and will affect any of our sibling services you may use.
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {errors.nickname && (
          <div className="my-4 flex flex-col rounded-xl bg-slate-800/70 p-4 shadow-xl">
            <div className="flex flex-row items-center space-x-4">
              <Info className="h-10 w-10 fill-red-600" />
              <h2 className="text-2xl font-bold text-red-600">Important!</h2>
            </div>
            <div className="flex flex-row pl-14 text-lg text-slate-200">
              {errors.nickname.message}
            </div>
          </div>
        )}
        <div className="mt-10">
          <div className="mb-4 text-xl text-slate-300">Enter your nickname</div>
          <div className="flex flex-col space-x-0 space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
            <input
              {...register("nickname", {
                required: { value: true, message: "A nickanme is required" },
                maxLength: { value: 64, message: "Nickname is too long" },
              })}
              type="text"
              placeholder="Enter nickname..."
              className="flex w-full max-w-sm space-y-2 rounded-lg border border-black bg-slate-100 p-2.5 text-slate-900 md:max-w-xl"
            />
          </div>
        </div>
        <div className="mb-10 mt-20 flex flex-row space-x-6">
          <Button
            type="button"
            size="large"
            variant="secondary"
            onClick={() => router.push("/dashboard/setup")}
          >
            Back
          </Button>
          <Button size="large" type="submit">
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
}