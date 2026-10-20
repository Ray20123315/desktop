const RestrictedFileExtensions = ['.cmd', '.exe', '.bat', '.sh']
export const CopyFilePathLabel = __DARWIN__
  ? 'Copy File Path'
  : 'Copy file path'

export const CopyRelativeFilePathLabel = __DARWIN__
  ? '複製相對檔案路徑'
  : '複製相對檔案路徑'

export const CopySelectedPathsLabel = __DARWIN__ ? '複製路徑' : '複製路徑'

export const CopySelectedRelativePathsLabel = __DARWIN__
  ? '複製相對路徑'
  : '複製相對路徑'

export const DefaultEditorLabel = __DARWIN__
  ? '開啟預設編輯器'
  : '開啟預設編輯器'

export const DefaultShellLabel = __DARWIN__ ? '開啟終端' : '開啟終端'

export const RevealInFileManagerLabel = __DARWIN__
  ? '開啟檔案位置'
  : __WIN32__
  ? '開啟檔案位置'
  : '開啟檔案位置'

export const TrashNameLabel = __WIN32__ ? '回收站' : '廢紙簍'

export const OpenWithDefaultProgramLabel = __DARWIN__
  ? '開啟預設處理軟體'
  : '開啟預設處理軟體'

export function isSafeFileExtension(extension: string): boolean {
  if (__WIN32__) {
    return RestrictedFileExtensions.indexOf(extension.toLowerCase()) === -1
  }
  return true
}
