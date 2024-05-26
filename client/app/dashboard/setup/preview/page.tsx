"use client";
import { AccordionManager } from "@/components";
import { SetupBook, SetupBookshelf, useSetupWizard } from "@/hooks";
import { getApiClient } from "@/services";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Button } from "@jecfe/react-design-system";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { SetupModal } from "../../SetupModal";
import { ReviewOption } from "./ReviewOptions";

var setupCustomer = getApiClient()
  .path("/action/setup-customer")
  .method("post")
  .create();

var updateNickname = getApiClient()
  .path("/customer/update")
  .method("post")
  .create();

export default function Preview() {
  const { isComplete, nickname, books, bookshelves, includeDefaults } =
    useSetupWizard();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [nicknameError, setNicknameError] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [customerBooks, setCustomerBooks] = useState<SetupBook[]>([]);
  const [customerNickname, setCustomerNickname] = useState<
    string | undefined
  >();
  const [customerBookshelves, setCustomerBookshelves] =
    useState<SetupBookshelf>([]);
  const [customerDefaults, setCustomerDefaults] = useState<boolean>();

  useEffect(() => {
    if (nickname === undefined) {
      return;
    }
    setCustomerNickname(nickname);
  }, [nickname, books, bookshelves, includeDefaults]);
  useEffect(() => {
    if (books === undefined) {
      return;
    }
    setCustomerBooks(books);
  }, [books, bookshelves, includeDefaults]);
  useEffect(() => {
    if (bookshelves === undefined) {
      return;
    }
    setCustomerBookshelves(bookshelves);
  }, [bookshelves]);
  useEffect(() => {
    setCustomerDefaults(includeDefaults);
  }, [bookshelves]);

  const router = useRouter();

  useEffect(() => {
    if (!isComplete) {
      router.push("/dashboard/setup");
    }
  }, []);

  const onContinue = async () => {
    setIsLoading(true);
    if (user?.nickname !== nickname) {
      try {
        setNicknameError(undefined);
        await updateNickname({
          id: user?.sub as string,
          nickname: customerNickname,
        });
      } catch (e) {
        setNicknameError(
          "Something went wrong with updating your username, please try this again later",
        );
      }
    }
    try {
      setError(undefined);
      await setupCustomer({
        id: user!.sub as string,
        bookshelvesNames: bookshelves,
        isbns: books?.map((x) => x.isbn),
        includeDefaultBookshelves: includeDefaults,
      });
      router.push("/dashboard");
    } catch {
      setError(
        "Something went wrong with setting up your account. Please try again later, or contact an admin",
      );
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col">
      <SetupModal />

      <h1 className="flex flex-col text-5xl font-bold tracking-tight text-slate-200 md:text-8xl">
        Review account setup
      </h1>
      <div className="mt-4 flex max-w-sm flex-row text-xl font-bold tracking-tight text-slate-400 md:max-w-4xl md:text-3xl">
        This will be how we setup your account, make any changes necessary. You
        are able to change any of these at a later point also.
      </div>

      <div className="mt-10 flex flex-col space-y-10">
        <ReviewOption title="Review nickname" href="/dashboard/setup/nickname">
          {customerNickname}
        </ReviewOption>
        <ReviewOption
          title="Review bookshelves"
          href="/dashboard/setup/bookshelves"
        >
          <div>
            {customerDefaults !== undefined && customerDefaults
              ? "Default bookshelves will be included."
              : "Default bookshelves won't be included."}
          </div>
          {customerBookshelves && customerBookshelves.length > 0 && (
            <AccordionManager
              className="max-w-lg space-y-3 pt-4"
              accordions={[
                {
                  title: "Proposed bookshelves",
                  children: (
                    <div className="space-y-1 divide-y divide-slate-500 pb-1">
                      {customerBookshelves.map((bookshelf, index) => (
                        <div
                          key={`${bookshelf}-${index}`}
                          className="flex flex-row pr-2 pt-1 text-slate-300"
                        >
                          {bookshelf}
                        </div>
                      ))}
                    </div>
                  ),
                },
              ]}
            />
          )}
        </ReviewOption>
        <ReviewOption title="Review books" href="/dashboard/setup/books">
          {customerBooks && customerBooks.length > 0 ? (
            <AccordionManager
              className="max-w-lg space-y-3 pt-4"
              accordions={[
                {
                  title: "Proposed books",
                  children: (
                    <div className="space-y-1 divide-y divide-slate-500 pb-1">
                      {customerBooks.map((book, index) => (
                        <div
                          key={`${book}-${index}`}
                          className="flex flex-row pr-2 pt-1 text-slate-300"
                        >
                          {book.name}
                        </div>
                      ))}
                    </div>
                  ),
                },
              ]}
            />
          ) : (
            "No books to be added during setup."
          )}
        </ReviewOption>
      </div>
      <div className="mb-10 mt-20 flex flex-row space-x-6">
        <Button
          size="large"
          variant="secondary"
          onClick={() => router.push("/dashboard/setup/books")}
          disabled={isLoading}
        >
          Back
        </Button>
        <Button size="large" isLoading={isLoading} onClick={onContinue}>
          Continue
        </Button>
      </div>
    </div>
  );
}
