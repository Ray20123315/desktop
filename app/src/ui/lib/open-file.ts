import { shell } from '../../lib/app-shell'
import { Dispatcher } from '../dispatcher'

export async function openFile(
  fullPath: string,
  dispatcher: Dispatcher
): Promise<void> {
  const errorMessage = await shell.openPath(fullPath)

  if (errorMessage !== '') {
    const error = {
      name: 'no-external-program',
      message: `無法用外部軟體開啟 ${fullPath} 檔案。請檢查該副檔名是否存在預設處理軟體。`,
    }
    await dispatcher.postError(error)
  }
}
