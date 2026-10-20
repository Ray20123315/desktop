/**
 * Traditional Chinese (Taiwan) labels for the application menu.
 *
 * Keep the original command IDs and keyboard accelerators: labels are changed
 * after ensureItemIds() has constructed stable identifiers.
 */
const labels: Readonly<Record<string, string>> = {
  'File': '檔案',
  'Edit': '編輯',
  'View': '檢視',
  'Repository': '儲存庫',
  'Branch': '分支',
  'Help': '說明',
  'New Repository…': '新增儲存庫…',
  'Add Local Repository…': '加入本機儲存庫…',
  'Clone Repository…': '複製儲存庫…',
  'Options…': '選項…',
  'Settings…': '設定…',
  'Exit': '結束',
  'Undo': '復原',
  'Redo': '取消復原',
  'Cut': '剪下',
  'Copy': '複製',
  'Paste': '貼上',
  'Select All': '全選',
  'Find': '尋找',
  'Show Changes': '顯示變更',
  'Changes': '變更',
  'Show History': '顯示歷史紀錄',
  'History': '歷史紀錄',
  'Show Repository List': '顯示儲存庫清單',
  'Repository list': '儲存庫清單',
  'Show Branches List': '顯示分支清單',
  'Branches list': '分支清單',
  'Show Worktrees List': '顯示工作樹清單',
  'Worktrees list': '工作樹清單',
  'Go to Summary': '移至提交摘要',
  'Hide Stashed Changes': '隱藏暫存的變更',
  'Show Stashed Changes': '顯示暫存的變更',
  'Hide Changes Filter': '隱藏變更篩選器',
  'Show Changes Filter': '顯示變更篩選器',
  'Hide Toggle Changes Filter': '隱藏變更篩選器',
  'Show Toggle Changes Filter': '顯示變更篩選器',
  'Toggle Full Screen': '切換全螢幕',
  'Reset Zoom': '重設縮放',
  'Zoom In': '放大',
  'Zoom Out': '縮小',
  'Expand Active Resizable': '展開目前窗格',
  'Contract Active Resizable': '縮小目前窗格',
  'Reload': '重新載入',
  'Toggle Developer Tools': '切換開發人員工具',
  'Push': '推送',
  'Pull': '提取',
  'Fetch': '擷取',
  'Force Push': '強制推送',
  'Force Push…': '強制推送…',
  'Remove': '移除',
  'Remove…': '移除…',
  'View on GitHub': '在 GitHub 上檢視',
  'Show in Explorer': '在檔案總管中顯示',
  'Show in Finder': '在 Finder 中顯示',
  'Show in your File Manager': '在檔案管理員中顯示',
  'Open in GitHub Copilot': '使用 GitHub Copilot 開啟',
  'Open With…': '開啟方式…',
  'Create Issue on GitHub': '在 GitHub 上建立 Issue',
  'New Worktree…': '新增工作樹…',
  'Repository Settings…': '儲存庫設定…',
  'New Branch…': '新增分支…',
  'Rename…': '重新命名…',
  'Delete…': '刪除…',
  'Discard All Changes…': '捨棄所有變更…',
  'Stash All Changes': '暫存所有變更',
  'Stash All Changes…': '暫存所有變更…',
  'Default Branch': '預設分支',
  'default branch': '預設分支',
  'Compare to Branch': '與其他分支比較',
  'Merge into Current Branch…': '合併至目前分支…',
  'Squash and Merge into Current Branch…': '壓縮提交並合併至目前分支…',
  'Rebase Current Branch…': '將目前分支變基…',
  'View Branch on GitHub': '在 GitHub 上檢視分支',
  'View Pull Request on GitHub': '在 GitHub 上檢視 Pull Request',
  'Create Pull Request': '建立 Pull Request',
  'Create pull request': '建立 Pull Request',
  'View pull request on GitHub': '在 GitHub 上檢視 Pull Request',
  'Preview Pull Request': '預覽 Pull Request',
  'Compare on GitHub': '在 GitHub 上比較',
  'Report Issue…': '回報問題…',
  'Contact GitHub Support…': '聯絡 GitHub 支援…',
  'Show User Guides': '顯示使用指南',
  'Show Keyboard Shortcuts': '顯示鍵盤快速鍵',
  'Show logs in Explorer': '在檔案總管中顯示記錄檔',
  'Show Logs in Finder': '在 Finder 中顯示記錄檔',
  'Show logs in your File Manager': '在檔案管理員中顯示記錄檔',
  'About GitHub Desktop': '關於 GitHub Desktop',
  'Install Command Line Tool…': '安裝命令列工具…',
}

/** Keep one-letter Windows access keys, even when the visible label is Chinese. */
export function localizeMenuLabel(label: string): string {
  const accessKey = /&([a-z])/i.exec(label)
  const english = label.replace(/&(?=[a-z])/gi, '')

  let translated = labels[english]
  if (translated === undefined) {
    if (english.startsWith('Update from ')) {
      translated = '從 ' + english.slice('Update from '.length) + ' 更新'
    } else if (english.startsWith('Open in ')) {
      translated = '使用 ' + english.slice('Open in '.length) + ' 開啟'
    } else if (english.startsWith('Compare to ')) {
      translated = '與 ' + english.slice('Compare to '.length) + ' 比較'
    } else {
      return label
    }
  }

  return accessKey === null
    ? translated
    : translated + '(&' + accessKey[1].toUpperCase() + ')'
}

/** Translate native menu labels without changing IDs, shortcuts or callbacks. */
export function localizeMenuTemplate(
  items: ReadonlyArray<Electron.MenuItemConstructorOptions>
): void {
  for (const item of items) {
    if (item.label !== undefined) {
      item.label = localizeMenuLabel(item.label)
    }

    if (Array.isArray(item.submenu)) {
      localizeMenuTemplate(item.submenu)
    }
  }
}
