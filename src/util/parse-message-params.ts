export default function getParams(text = ''): URLSearchParams {
  const messageArray = text.split('?') ?? ['', ''];
  const messageText = messageArray[1];
  return new URLSearchParams(messageText);
}
