// RARE QUEST — управление историями через Supabase

const SUPABASE_URL = 'https://fdlqpsktdbfvcogwegta.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Nhlq0ZCaRmde6DPgAlsKVA_iwNDgpMj';

const adminClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const loginSection = document.querySelector('#loginSection');
const adminSection = document.querySelector('#adminSection');
const loginForm = document.querySelector('#loginForm');
const questForm = document.querySelector('#questForm');
const loginMessage = document.querySelector('#loginMessage');
const adminMessage = document.querySelector('#adminMessage');
const questList = document.querySelector('#questList');

function message(element, text) {
  element.textContent = text;
}

function clearForm() {
  questForm.reset();
  document.querySelector('#questId').value = '';
  document.querySelector('#sortOrder').value = '0';
  document.querySelector('#isPublished').checked = true;
}

async function checkOwner() {
  const { data: { user } } = await adminClient.auth.getUser();

  if (!user) {
    loginSection.hidden = false;
    adminSection.hidden = true;
    return;
  }

  const { data: profile, error } = await adminClient
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (error || !profile || profile.role !== 'owner') {
    message(loginMessage, 'У этого аккаунта нет прав владельца.');
    await adminClient.auth.signOut();
    loginSection.hidden = false;
    adminSection.hidden = true;
    return;
  }

  loginSection.hidden = true;
  adminSection.hidden = false;
  await loadQuests();
}

loginForm.addEventListener('submit', async event => {
  event.preventDefault();
  message(loginMessage, 'Выполняется вход...');

  const email = document.querySelector('#email').value.trim();
  const password = document.querySelector('#password').value;

  const { error } = await adminClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    message(loginMessage, 'Ошибка входа: ' + error.message);
    return;
  }

  await checkOwner();
});

questForm.addEventListener('submit', async event => {
  event.preventDefault();
  message(adminMessage, 'Сохраняю историю...');

  const id = document.querySelector('#questId').value;

  const quest = {
    title: document.querySelector('#title').value.trim(),
    genre: document.querySelector('#genre').value.trim(),
    description: document.querySelector('#description').value.trim(),
    duration: document.querySelector('#duration').value.trim(),
    age_limit: document.querySelector('#ageLimit').value.trim(),
    difficulty: document.querySelector('#difficulty').value.trim(),
    sort_order: Number(document.querySelector('#sortOrder').value) || 0,
    is_published: document.querySelector('#isPublished').checked,
    updated_at: new Date().toISOString()
  };

  let result;

  if (id) {
    result = await adminClient
      .from('quests')
      .update(quest)
      .eq('id', id);
  } else {
    result = await adminClient
      .from('quests')
      .insert(quest);
  }

  if (result.error) {
    message(adminMessage, 'Ошибка сохранения: ' + result.error.message);
    return;
  }

  message(adminMessage, 'История сохранена!');
  clearForm();
  await loadQuests();
});

async function loadQuests() {
  message(adminMessage, 'Загружаю истории...');

  const { data, error } = await adminClient
    .from('quests')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    message(adminMessage, 'Ошибка загрузки: ' + error.message);
    return;
  }

  questList.innerHTML = '';

  if (!data || data.length === 0) {
    questList.textContent = 'Историй пока нет.';
    message(adminMessage, '');
    return;
  }

  data.forEach(quest => {
    const item = document.createElement('div');
    item.className = 'admin-quest-item';

    const title = document.createElement('h3');
    title.textContent = quest.title;

    const status = document.createElement('p');
    status.textContent = quest.is_published ? 'Опубликована' : 'Скрыта';

    const editButton = document.createElement('button');
    editButton.type = 'button';
    editButton.textContent = 'ИЗМЕНИТЬ';
    editButton.addEventListener('click', () => editQuest(quest));

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.textContent = 'УДАЛИТЬ';
    deleteButton.addEventListener('click', () => deleteQuest(quest.id));

    item.append(title, status, editButton, deleteButton);
    questList.appendChild(item);
  });

  message(adminMessage, '');
}

function editQuest(quest) {
  document.querySelector('#questId').value = quest.id;
  document.querySelector('#title').value = quest.title || '';
  document.querySelector('#genre').value = quest.genre || '';
  document.querySelector('#description').value = quest.description || '';
  document.querySelector('#duration').value = quest.duration || '';
  document.querySelector('#ageLimit').value = quest.age_limit || '';
  document.querySelector('#difficulty').value = quest.difficulty || '';
  document.querySelector('#sortOrder').value = quest.sort_order ?? 0;
  document.querySelector('#isPublished').checked = !!quest.is_published;

  message(adminMessage, 'Редактирование: ' + quest.title);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function deleteQuest(id) {
  if (!confirm('Точно удалить эту историю?')) return;

  const { error } = await adminClient
    .from('quests')
    .delete()
    .eq('id', id);

  if (error) {
    message(adminMessage, 'Ошибка удаления: ' + error.message);
    return;
  }

  message(adminMessage, 'История удалена.');
  clearForm();
  await loadQuests();
}

document.querySelector('#cancelEdit').addEventListener('click', () => {
  clearForm();
  message(adminMessage, '');
});

document.querySelector('#logoutButton').addEventListener('click', async () => {
  await adminClient.auth.signOut();
  loginSection.hidden = false;
  adminSection.hidden = true;
  clearForm();
});

adminClient.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    loginSection.hidden = false;
    adminSection.hidden = true;
  }
});

checkOwner();
