'use strict';

/**
 * Bot Telegram kiểm tra API miners/latest và gửi thông báo khi dữ liệu thay đổi.
 * Yêu cầu biến môi trường:
 * - TELEGRAM_BOT_TOKEN: token bot Telegram
 * - TELEGRAM_CHAT_ID: chat id đích (user hoặc group)
 * - POLL_INTERVAL_MS (tùy chọn): chu kỳ kiểm tra, mặc định 60000ms
 */

import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Hỗ trợ chạy trong môi trường ESM (không có __dirname sẵn)
const __filename = fileURLToPath(import.meta.url);
const runtimeDirname = path.dirname(__filename);

const API_URL = 'https://api-focus.omegatron.ai/miners/latest';
const CACHE_FILE = path.join(runtimeDirname, 'miners-cache.json');
const TELEGRAM_BOT_TOKEN = "8221827286:AAGtkzyyMawhH4QHVaSFjxGxzdlNT-cVGgs";
const TELEGRAM_CHAT_ID = "6988820852";
// 3 phut
const POLL_INTERVAL_MS = Number(process.env.POLL_INTERVAL_MS || 180000);

if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
  console.error('Thiếu TELEGRAM_BOT_TOKEN hoặc TELEGRAM_CHAT_ID trong biến môi trường.');
  process.exit(1);
}

const telegramClient = axios.create({
  baseURL: `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`,
  timeout: 10000,
});

function loadCache() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const raw = fs.readFileSync(CACHE_FILE, 'utf8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Không thể đọc cache, sẽ bỏ qua.', err.message);
  }
  return [];
}

function saveCache(data) {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.warn('Không thể lưu cache:', err.message);
  }
}

function compareMiners(oldMiners, newMiners) {
  const oldMap = new Map(oldMiners.map((m) => [m.task_id, m]));
  const newMap = new Map(newMiners.map((m) => [m.task_id, m]));

  const newItems = newMiners.filter((m) => !oldMap.has(m.task_id));
  const removedItems = oldMiners.filter((m) => !newMap.has(m.task_id));
  const updatedItems = newMiners.filter((m) => {
    const old = oldMap.get(m.task_id);
    return old && old.earned_reward_tao !== m.earned_reward_tao;
  });

  return { newItems, updatedItems, removedItems };
}

async function sendTelegramMessage(text) {
  try {
    await telegramClient.post('/sendMessage', {
      chat_id: TELEGRAM_CHAT_ID,
      text,
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
    });
  } catch (err) {
    console.error('Gửi Telegram thất bại:', err.message);
  }
}

async function fetchMiners() {
  const res = await axios.post(API_URL, undefined, { timeout: 2000 });
  return Array.isArray(res.data) ? res.data : [];
}

function formatMiner(miner) {
  return [
    `🎥 ${miner.video_id}`,
    `🆔 ${miner.task_id}`,
    `💰 ${miner.earned_reward_tao}`,
    `🎯 ${miner.focusing_task}`,
  ].join(' | ');
}

function newMinersSummary(miners) {
  if (!miners || miners.length === 0) {
    return 'Danh sách rỗng.';
  }
  const body = miners.slice(0, 10).map(formatMiner).join('\n');
  return `Tổng: ${miners.length} bản ghi\n${body}`;
}

async function handleDiff(oldMiners, newMiners) {
  const { newItems, updatedItems, removedItems } = compareMiners(oldMiners, newMiners);

  if (newItems.length === 0 && updatedItems.length === 0 && removedItems.length === 0) {
    console.log('Không có thay đổi.');
    const body = newMinersSummary(newMiners);
    // await sendTelegramMessage(`⏱️ Chu kỳ poll hoàn tất - không có thay đổi.\n${body}`);
    return;
  }

  if (newItems.length > 0) {
    const body = newItems.slice(0, 5).map(formatMiner).join('\n');
    await sendTelegramMessage(`🆕 Có ${newItems.length} miner mới:\n${body}`);
  }

  if (updatedItems.length > 0) {
    const body = updatedItems
      .slice(0, 5)
      .map((m) => `${formatMiner(m)} | reward mới`);
    await sendTelegramMessage(`📈 ${updatedItems.length} miner thay đổi reward:\n${body.join('\n')}`);
  }

  if (removedItems.length > 0) {
    const body = removedItems.slice(0, 5).map(formatMiner).join('\n');
    await sendTelegramMessage(`❌ ${removedItems.length} miner bị gỡ:\n${body}`);
  }
}

async function poll() {
  await sendTelegramMessage('Bot đã chạy thành công.');
  let previous = loadCache();
  console.log(`Bắt đầu poll mỗi ${POLL_INTERVAL_MS}ms...`);

  const tick = async () => {
    try {
      const latest = await fetchMiners();
      await handleDiff(previous, latest);
      previous = latest;
      saveCache(latest);
    } catch (err) {
      console.error('Lỗi khi lấy dữ liệu:', err.message);
    }
  };

  await tick(); // chạy ngay lần đầu
  setInterval(tick, POLL_INTERVAL_MS);
}

poll().catch((err) => {
  console.error('Bot dừng do lỗi:', err);
  process.exit(1);
});

