# RFC 0019: 课程资产包 (Bundle) 管理规范

**状态**: 🟡 草稿  
**作者**: AI Assistant  
**创建日期**: 2026-01-25  
**最后更新**: 2026-01-25

## 1. 摘要

本 RFC 定义了 Fluence 课程物理资产包的物理组织结构、打包协议（Packaging Protocol）以及导出/导入流程。资产包旨在实现课程内容的**离线分发**、**异地备份**以及**完全自包含运行**。

## 2. 物理目录规范 (The Archive Layout)

一个完整的 Fluence 资产包（建议命名后缀为 `.flz`，本质为加密或压缩的 ZIP 包）其解压后的物理布局必须符合：

```text
/my-awesome-lesson/
├── lesson.flf           # 任务流编排清单 (Mission Flow Manifest)
├── assets/              # 媒体资产 (Video/Audio/PDF)
│   ├── video_01.mp4
│   └── cover.png
└── nested_quizzes/      # 任务节点引用的测验 (.quiz)
    ├── intro.quiz
    └── final.quiz
```

---

## 3. 引用转换规则 (Path Resolution)

### 3.1 导出时 (Packaging)

当系统执行“导出资产包”时：

1.  **资产抓取**：遍历 `lesson.flf` 中的 `asset_manifest`。
2.  **重定位**：
    - 若 `uri` 为 `asset://` (数据库资产)，则将其物理文件下载到 `assets/` 目录。
    - 若 `uri` 为 `remote://` (URL)，系统根据配置决定是保留远程链接，还是下载并转为 `local://`（离线包模式）。
3.  **路径更新**：修改 `lesson.flf` 中的 `src`，使其统一指向包内相对路径（`local://...`）。

### 3.2 导入时 (Unpacking/Ingesting)

当用户上传 `.flz` 包时：

1.  **指纹校验**：通过 `lesson.flf` 的 `fingerprint` 校验包内容的完整性。
2.  **资产反向映射**：系统将物理文件存入云存储或数据库，并将 `local://` 重新转换为系统的 `asset://` 或 `remote://` 链接。

---

## 4. 传输协议与安全性

- **压缩标准**：使用 ZIP 格式。
- **完整性哈希**：每个资产在 `lesson.flf` 中对应的 `hash` 必须与物理文件匹配，否则导入失败。
- **资源限制**：设置单包最大尺寸（如 500MB），防止存储压力。

---

#### 签核确认 (Approval)

- [ ] 确认 `.flz` 包的内部物理目录结构。
- [ ] 确认导出时的资产重定位逻辑（尤其是离线包模式）。
