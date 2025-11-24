/**
 * Authorization Utilities
 * Enforce row-level security and ownership checks for user data
 */

/**
 * Ensure a user owns a specific record before allowing access
 * Provides defense-in-depth even if RLS policies are misconfigured
 *
 * @param {Object} supabaseClient - Authenticated Supabase client
 * @param {string} table - Table name (e.g., 'saved_designs', 'projects')
 * @param {string} recordId - Record ID to check
 * @param {string} userId - User ID who should own the record
 * @param {string} [userIdColumn='user_id'] - Column name for user ownership
 * @returns {Promise<Object|null>} Record if owned by user, null otherwise
 */
export async function ensureOwnership(
  supabaseClient,
  table,
  recordId,
  userId,
  userIdColumn = 'user_id'
) {
  if (!recordId || !userId) {
    console.warn('[AUTH] Missing recordId or userId in ownership check');
    return null;
  }

  try {
    const { data, error } = await supabaseClient
      .from(table)
      .select('*')
      .eq('id', recordId)
      .eq(userIdColumn, userId) // CRITICAL: Explicit ownership check
      .single();

    if (error) {
      console.error(`[AUTH] Ownership check failed for ${table}:${recordId}:`, error);
      return null;
    }

    if (!data) {
      console.warn(
        `[AUTH] Ownership violation: User ${userId} attempted to access ` +
        `${table}:${recordId} they don't own`
      );
      return null;
    }

    return data;
  } catch (error) {
    console.error(`[AUTH] Ownership check error for ${table}:${recordId}:`, error);
    return null;
  }
}

/**
 * Check if a user owns a record (returns boolean instead of data)
 *
 * @param {Object} supabaseClient - Authenticated Supabase client
 * @param {string} table - Table name
 * @param {string} recordId - Record ID to check
 * @param {string} userId - User ID who should own the record
 * @param {string} [userIdColumn='user_id'] - Column name for user ownership
 * @returns {Promise<boolean>} True if user owns record, false otherwise
 */
export async function checkOwnership(
  supabaseClient,
  table,
  recordId,
  userId,
  userIdColumn = 'user_id'
) {
  const record = await ensureOwnership(supabaseClient, table, recordId, userId, userIdColumn);
  return record !== null;
}

/**
 * Ensure a user can only update their own records
 * Use this wrapper for update/delete operations
 *
 * @param {Object} supabaseClient - Authenticated Supabase client
 * @param {string} table - Table name
 * @param {string} recordId - Record ID to update/delete
 * @param {string} userId - User ID performing the operation
 * @param {Object} updates - Updates to apply (or null for delete check)
 * @param {string} [userIdColumn='user_id'] - Column name for user ownership
 * @returns {Promise<Object>} Result object with { success, error, data }
 */
export async function authorizedUpdate(
  supabaseClient,
  table,
  recordId,
  userId,
  updates,
  userIdColumn = 'user_id'
) {
  // First verify ownership
  const owned = await checkOwnership(supabaseClient, table, recordId, userId, userIdColumn);

  if (!owned) {
    return {
      success: false,
      error: 'Unauthorized: You do not own this resource',
      data: null
    };
  }

  // Perform update with explicit ownership check (defense in depth)
  const { data, error } = await supabaseClient
    .from(table)
    .update(updates)
    .eq('id', recordId)
    .eq(userIdColumn, userId) // CRITICAL: Double-check ownership in update
    .select()
    .single();

  if (error) {
    return {
      success: false,
      error: error.message,
      data: null
    };
  }

  return {
    success: true,
    error: null,
    data
  };
}

/**
 * Ensure a user can only delete their own records
 *
 * @param {Object} supabaseClient - Authenticated Supabase client
 * @param {string} table - Table name
 * @param {string} recordId - Record ID to delete
 * @param {string} userId - User ID performing the operation
 * @param {string} [userIdColumn='user_id'] - Column name for user ownership
 * @returns {Promise<Object>} Result object with { success, error }
 */
export async function authorizedDelete(
  supabaseClient,
  table,
  recordId,
  userId,
  userIdColumn = 'user_id'
) {
  // First verify ownership
  const owned = await checkOwnership(supabaseClient, table, recordId, userId, userIdColumn);

  if (!owned) {
    return {
      success: false,
      error: 'Unauthorized: You do not own this resource'
    };
  }

  // Perform delete with explicit ownership check (defense in depth)
  const { error } = await supabaseClient
    .from(table)
    .delete()
    .eq('id', recordId)
    .eq(userIdColumn, userId); // CRITICAL: Double-check ownership in delete

  if (error) {
    return {
      success: false,
      error: error.message
    };
  }

  return {
    success: true,
    error: null
  };
}

/**
 * List records owned by a user with pagination
 *
 * @param {Object} supabaseClient - Authenticated Supabase client
 * @param {string} table - Table name
 * @param {string} userId - User ID
 * @param {Object} options - Query options
 * @param {number} [options.limit=50] - Max results (capped at 100)
 * @param {number} [options.offset=0] - Offset for pagination
 * @param {string} [options.orderBy='created_at'] - Column to order by
 * @param {boolean} [options.ascending=false] - Sort order
 * @param {string} [options.userIdColumn='user_id'] - Column name for user ownership
 * @returns {Promise<Object>} Result object with { success, data, error, count }
 */
export async function listUserRecords(
  supabaseClient,
  table,
  userId,
  options = {}
) {
  const {
    limit = 50,
    offset = 0,
    orderBy = 'created_at',
    ascending = false,
    userIdColumn = 'user_id'
  } = options;

  // Cap limit to prevent abuse
  const cappedLimit = Math.min(limit, 100);

  try {
    const { data, error, count } = await supabaseClient
      .from(table)
      .select('*', { count: 'exact' })
      .eq(userIdColumn, userId) // CRITICAL: Only user's records
      .order(orderBy, { ascending })
      .range(offset, offset + cappedLimit - 1);

    if (error) {
      return {
        success: false,
        data: null,
        error: error.message,
        count: 0
      };
    }

    return {
      success: true,
      data,
      error: null,
      count
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error.message,
      count: 0
    };
  }
}
