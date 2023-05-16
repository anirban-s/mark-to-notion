document.addEventListener("DOMContentLoaded", () => {
  const url = document.getElementById("url");
  const saveToNotion = document.getElementById("save-to-notion");
  const textSecret = document.getElementById("secret");
  const toggleSecret = document.getElementById("toggleSecret");
  const textSecretContainer = document.getElementById("secret-input");

  let secret = localStorage.getItem("notionKey");
  if (secret) {
    textSecret.value = secret;
    textSecretContainer.style.display = "none";
  } else {
    textSecretContainer.style.display = "block";
    textSecret.placeholder = "Paste Your Notion API Key";
  }

  toggleSecret.addEventListener("click", () => {
    if (textSecretContainer.style.display === "none") {
      textSecretContainer.style.display = "block";
    } else {
      secret = textSecret.value;
      localStorage.setItem("notionKey", secret);
      textSecretContainer.style.display = "none";
    }
  });

  saveToNotion.addEventListener("click", () => {
    if (url.value.length > 0) {
      main(url.value);
    }
  });

  async function getPageId(pageName) {
    let response = await fetch("https://api.notion.com/v1/search", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify({
        query: pageName,
        filter: {
          value: "page",
          property: "object",
        },
        sort: {
          direction: "ascending",
          timestamp: "last_edited_time",
        },
      }),
    });

    response = await response.json();
    return response.results[0].id;
  }

  async function checkPageExists(pageName) {
    let response = await fetch("https://api.notion.com/v1/search", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify({
        query: pageName,
        filter: {
          value: "page",
          property: "object",
        },
        sort: {
          direction: "ascending",
          timestamp: "last_edited_time",
        },
      }),
    });

    response = await response.json();
    console.log(response);
    return response.results.length > 0;
  }

  async function createPage(pageId, title, url) {
    const response = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify({
        parent: {
          type: "page_id",
          page_id: pageId,
        },
        properties: {
          title: [
            {
              type: "text",
              text: {
                content: title,
              },
            },
          ],
        },
        children: [
          {
            object: "block",
            type: "embed",
            embed: {
              url: url,
            },
          },
        ],
      }),
    });

    document.getElementById("url").value = "";

    const notifOptions = {
      type: "basic",
      iconUrl: "icon48.png",
      title: "Saved!",
      message: "The tweet is saved to Notion page.",
    };

    chrome.notifications.create("saveNotification", notifOptions);
  }

  async function appendBlock(pageId, url) {
    const response = await fetch(
      `https://api.notion.com/v1/blocks/${pageId}/children`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${secret}`,
          "Content-Type": "application/json",
          "Notion-Version": "2022-06-28",
        },
        body: JSON.stringify({
          children: [
            {
              object: "block",
              type: "embed",
              embed: {
                url: url,
              },
            },
          ],
        }),
      }
    );

    document.getElementById("url").value = "";

    const notifOptions = {
      type: "basic",
      iconUrl: "icon48.png",
      title: "Saved!",
      message: "The tweet is saved to Notion page.",
    };

    chrome.notifications.update("saveNotification", notifOptions);
  }

  function getTwitterHandler(url) {
    let name = url.split("/")[3];
    return "@" + name;
  }

  async function main(url) {
    const parent = "Twitter Bookmarks";
    const child = getTwitterHandler(url);
    let pageId;

    const isChildPageExist = await checkPageExists(child);
    if (isChildPageExist) {
      pageId = await getPageId(child);
      await appendBlock(pageId, url);
    } else {
      pageId = await getPageId(parent);
      await createPage(pageId, child, url);
    }
  }
});
