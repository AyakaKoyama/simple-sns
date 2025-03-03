import DeleteModal from "@/component/deleteModal";
import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";

jest.mock("@/component/deleteModal", () => ({
  __esModule: true,
  default: ({
    isOpen,
    onRequestClose,
    onDelete,
    postTitle,
  }: {
    isOpen: boolean;
    onRequestClose: () => void;
    onDelete: () => void;
    postTitle: string;
  }) => (
    <div>
      {isOpen && (
        <div id="delete-modal">
          <h3>タイトル：{postTitle}を削除しますか？</h3>
          <button onClick={onDelete}>削除</button>
          <button onClick={onRequestClose}>キャンセル</button>
        </div>
      )}
    </div>
  ),
}));

const onRequestClose = jest.fn();
const onDelete = jest.fn();

const renderDeleteModal = async () => {
  await act(async () => {
    render(
      <DeleteModal
        isOpen={true}
        onRequestClose={onRequestClose}
        onDelete={onDelete}
        postTitle="テストタイトル"
      />
    );
  });
};

describe("DeleteModal", () => {
  it("削除モーダルが表示されること", async () => {
    await renderDeleteModal();
    expect(
      screen.getByText("タイトル：テストタイトルを削除しますか？")
    ).toBeInTheDocument();
  });
  it("削除モーダルのキャンセルボタンを押すと削除モーダルが閉じること", async () => {
    await renderDeleteModal();
    fireEvent.click(screen.getByText("キャンセル"));
    expect(onRequestClose).toHaveBeenCalled();
  });

  it("削除モーダルの削除ボタンを押すと削除されること", async () => {
    await renderDeleteModal();

    fireEvent.click(screen.getByText("削除"));
    expect(onDelete).toHaveBeenCalled();
  });

  it("削除モーダルの削除ボタンを押すと削除モーダルが閉じること", async () => {
    await renderDeleteModal();
    fireEvent.click(screen.getByText("削除"));
    expect(onRequestClose).toHaveBeenCalled();
  });
});
