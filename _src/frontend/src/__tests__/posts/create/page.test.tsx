import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { getPosts, postPost } from "@/infra/api";
import { useRouter } from "next/compat/router";
import Page from "@/app/posts/create/page";

// APIとルーターのモック
jest.mock("@/infra/api", () => ({
  getPosts: jest.fn(),
  postPost: jest.fn(),
}));

const mockedUseRouter = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => mockedUseRouter(),
  usePathname: jest.fn().mockReturnValue("/posts/create"),
}));

describe("投稿作成ページ", () => {
  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    mockedUseRouter.mockReturnValue(mockRouter);
    (getPosts as jest.Mock).mockResolvedValue([]);
    (postPost as jest.Mock).mockResolvedValue({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("フォームが正しく表示されること", () => {
    render(<Page />);

    expect(screen.getByText("投稿作成")).toBeInTheDocument();
    expect(screen.getByLabelText("タイトル")).toBeInTheDocument();
    expect(screen.getByLabelText("内容")).toBeInTheDocument();
    expect(screen.getByLabelText("ユーザー名")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "投稿" })).toBeInTheDocument();
  });

  it.skip("必須フィールドが空の場合にエラーメッセージが表示されること", async () => {
    render(<Page />);

    fireEvent.click(screen.getByRole("button", { name: "投稿" }));

    await waitFor(() => {
      expect(screen.getByText("タイトルは必須です")).toBeInTheDocument();
      expect(screen.getByText("内容は必須です")).toBeInTheDocument();
      expect(screen.getByText("ユーザー名は必須です")).toBeInTheDocument();
    });
  });

  it.skip("ユーザー名が重複している場合にエラーメッセージが表示されること", async () => {
    (getPosts as jest.Mock).mockResolvedValue([{ username: "existingUser" }]);

    render(<Page />);

    const usernameInput = screen.getByLabelText("ユーザー名");
    fireEvent.change(usernameInput, { target: { value: "existingUser" } });
    fireEvent.blur(usernameInput);

    await waitFor(() => {
      expect(
        screen.getByText("ユーザー名が重複しています")
      ).toBeInTheDocument();
    });
  });

  it.skip("フォームが正しく送信されること", async () => {
    render(<Page />);

    fireEvent.change(screen.getByLabelText("タイトル"), {
      target: { value: "テストタイトル" },
    });
    fireEvent.change(screen.getByLabelText("内容"), {
      target: { value: "テスト内容" },
    });
    fireEvent.change(screen.getByLabelText("ユーザー名"), {
      target: { value: "テストユーザー" },
    });

    fireEvent.click(screen.getByRole("button", { name: "投稿" }));

    await waitFor(() => {
      expect(postPost).toHaveBeenCalledWith({
        title: "テストタイトル",
        content: "テスト内容",
        username: "テストユーザー",
      });
      expect(mockRouter.push).toHaveBeenCalledWith("/posts");
    });
  });
});
