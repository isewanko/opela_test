# 公演詳細ページ テンプレート

## 使用方法

`performance-detail-template.html`をコピーして、新しい公演の詳細ページを作成してください。

## プレースホルダー一覧

以下のプレースホルダーを実際の内容に置き換えてください：

### 基本情報
- `{{TITLE}}` - 公演タイトル（例: ドン・ジョヴァンニ）
- `{{DESCRIPTION}}` - メタディスクリプション
- `{{YEAR}}` - 公演年（例: 2026）
- `{{COMPOSER}}` - 作曲家名（例: W.アマデウス・モーツァルト）
- `{{SUBTITLE}}` - サブタイトル（例: 全2幕〈イタリア語上演／日本語字幕付〉）
- `{{DATE}}` - 公演日（例: 2026年6月15日（日））
- `{{DURATION}}` - 上演時間（例: 約2時間30分（休憩含む））
- `{{VENUE}}` - 会場名

### 画像
- `{{MAIN_IMAGE}}` - メインビジュアル画像のパス
- `{{STORY_IMAGE_1}}` - ストーリー第1幕の画像パス
- `{{STORY_IMAGE_2}}` - ストーリー第2幕の画像パス
- `{{FLYER_FRONT}}` - フライヤー表の画像パス
- `{{FLYER_BACK}}` - フライヤー裏の画像パス

### テキスト
- `{{SUBTITLE_TEXT}}` - イントロのサブタイトル
- `{{INTRODUCTION_TEXT}}` - イントロの本文
- `{{STORY_ACT_1}}` - ストーリー第1幕の内容
- `{{STORY_ACT_2}}` - ストーリー第2幕の内容

### スタッフ・キャスト
- `{{STAFF_LIST}}` - スタッフのテーブル行（例: `<tr><td class="staff-cast-role">【指 揮】</td><td class="staff-cast-name">名前</td></tr>`）
- `{{CAST_LIST}}` - キャストのテーブル行（例: `<tr><td class="staff-cast-role">【役名】</td><td class="staff-cast-name">名前</td></tr>`）

### チケット
- `{{TICKET_URL}}` - チケット購入URL

## 例

```html
<!-- スタッフリストの例 -->
{{STAFF_LIST}}
↓
<tr>
  <td class="staff-cast-role">【指 揮】</td>
  <td class="staff-cast-name">小林滉三</td>
</tr>
<tr>
  <td class="staff-cast-role">【演出・脚本】</td>
  <td class="staff-cast-name">塙翔平</td>
</tr>
```

## 注意事項

- フライヤーが1枚のみの場合は、2つ目の`performance-flyer-container`を削除してください
- ストーリーが1幕のみの場合は、2つ目の`story-block`を削除してください
- すべてのプレースホルダーを置き換えることを忘れずに

