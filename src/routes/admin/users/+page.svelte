<script>
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase.js';

  let users = [];
  let loading = true;
  let error = '';
  let q = '';
  let page = 1;
  let totalPages = 1;
  let token = '';

  onMount(async () => {
    const { data } = await supabase.auth.getSession();
    token = data?.session?.access_token || '';
    await loadUsers();
  });

  async function loadUsers() {
    loading = true;
    error = '';
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (q) params.set('q', q);
      const res = await fetch(`/api/admin/users?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const result = await res.json();
      if (result.success) {
        users = result.users;
        totalPages = result.pagination.total_pages || 1;
      } else {
        error = result.error || 'Failed to fetch users';
      }
    } catch (e) {
      error = 'Failed to fetch users';
    } finally {
      loading = false;
    }
  }

  async function setRole(userId, role) {
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ role })
      });
      const result = await res.json();
      if (result.success) {
        await loadUsers();
      } else {
        alert(result.error || 'Failed to update role');
      }
    } catch (e) {
      alert('Failed to update role');
    }
  }

  function handleSearch() {
    page = 1;
    loadUsers();
  }

  function gotoPage(p) {
    page = p;
    loadUsers();
  }
</script>

<section class="p-8 space-y-4">
  <h1 class="text-2xl font-bold">User Management</h1>

  <div class="flex gap-2">
    <input class="input input-bordered" placeholder="Search by email or name" bind:value={q} on:change={handleSearch} />
    <button class="btn" on:click={handleSearch}>Search</button>
  </div>

  {#if loading}
    <div class="py-12 text-center">
      <span class="loading loading-spinner loading-lg"></span>
    </div>
  {:else if error}
    <div class="alert alert-error">{error}</div>
  {:else}
    <div class="overflow-x-auto">
      <table class="table w-full">
        <thead>
          <tr>
            <th>Email</th>
            <th>Name</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each users as user}
            <tr>
              <td>{user.email}</td>
              <td>{user.full_name || '-'}</td>
              <td>
                <span class="badge {user.role === 'admin' ? 'badge-primary' : 'badge-secondary'}">{user.role}</span>
              </td>
              <td class="flex gap-2">
                {#if user.role !== 'admin'}
                  <button class="btn btn-xs" on:click={() => setRole(user.id, 'admin')}>Make Admin</button>
                {:else}
                  <button class="btn btn-xs btn-outline" on:click={() => setRole(user.id, 'customer')}>Remove Admin</button>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    {#if totalPages > 1}
      <div class="join">
        {#each Array(totalPages) as _, i}
          {@const p = i + 1}
          <button class="btn join-item" class:btn-active={page === p} on:click={() => gotoPage(p)}>{p}</button>
        {/each}
      </div>
    {/if}
  {/if}
</section>
