import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AdminButton, AdminCard, AdminInput, AdminLayout, AdminModal, AdminText, ConfirmModal, EmptyState, StatusBadge } from '../components/admin/AdminComponents';
import type { AdminScreenProps } from '../components/admin/AdminComponents';
import { emptyChallengeForm } from '../models/AdminModel';
import type { AdminChallenge, ChallengeForm, ChallengeStatus, FormErrors } from '../models/AdminModel';

const statuses: ChallengeStatus[] = ['Draft', 'Active', 'Completed'];
export default function ManageChallengesScreen(props: AdminScreenProps) {
  const { colors, vm } = props;
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string>();
  const [form, setForm] = useState<ChallengeForm>(emptyChallengeForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [deleting, setDeleting] = useState<AdminChallenge | null>(null);
  function openForm(challenge?: AdminChallenge) {
    setEditingId(challenge?.id);
    setForm(challenge ? { ...challenge, goal: String(challenge.goal), rewardPoints: String(challenge.rewardPoints) } : { ...emptyChallengeForm });
    setErrors({});
    setFormOpen(true);
  }
  function updateField(field: keyof ChallengeForm, value: string) {
    setForm(current => ({ ...current, [field]: value }));
    setErrors(current => {
      const remainingErrors = { ...current };
      delete remainingErrors[field];
      return remainingErrors;
    });
  }
  function save() {
    const validationErrors = vm.saveChallenge(form, editingId);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) setFormOpen(false);
  }
  return <AdminLayout {...props} screen="Manage Challenges" subtitle="Build goals your community can grow with.">
    <AdminButton colors={colors} title="+ Create Challenge" variant="lime" onPress={() => openForm()} />
    <AdminText colors={colors}>{vm.challenges.length} sample challenges · Status is set manually for this demo.</AdminText>
    {!vm.challenges.length && <EmptyState colors={colors} message="Create your first challenge using the button above." />}
    {vm.challenges.map(challenge => <AdminCard key={challenge.id} colors={colors}>
      <StatusBadge colors={colors} label={challenge.status} />
      <AdminText colors={colors} heading>{challenge.title}</AdminText>
      <AdminText colors={colors}>{challenge.description}</AdminText>
      <AdminText colors={colors}>Goal: {challenge.goal.toLocaleString()} {challenge.unit}</AdminText>
      <AdminText colors={colors}>Reward: {challenge.rewardPoints} points</AdminText>
      <AdminText colors={colors}>{challenge.startDate} → {challenge.endDate}</AdminText>
      <View style={styles.actions}>
        <AdminButton colors={colors} title="Edit challenge" onPress={() => openForm(challenge)} />
        <AdminButton colors={colors} title="Delete" variant="secondary" onPress={() => setDeleting(challenge)} />
      </View>
    </AdminCard>)}
    {formOpen && <AdminModal colors={colors} title={editingId ? 'Edit challenge' : 'Create challenge'} onClose={() => setFormOpen(false)}>
      <AdminText colors={colors}>All fields are required. Dates use YYYY-MM-DD.</AdminText>
      <AdminInput colors={colors} label="Title" value={form.title} error={errors.title} onChangeText={value => updateField('title', value)} />
      <AdminInput colors={colors} label="Description" multiline value={form.description} error={errors.description} onChangeText={value => updateField('description', value)} />
      <AdminInput colors={colors} label="Goal value" keyboardType="decimal-pad" value={form.goal} error={errors.goal} onChangeText={value => updateField('goal', value)} />
      <AdminInput colors={colors} label="Goal unit" placeholder="steps per day" value={form.unit} error={errors.unit} onChangeText={value => updateField('unit', value)} />
      <AdminInput colors={colors} label="Reward points" keyboardType="number-pad" value={form.rewardPoints} error={errors.rewardPoints} onChangeText={value => updateField('rewardPoints', value)} />
      <AdminInput colors={colors} label="Start date (YYYY-MM-DD)" autoCapitalize="none" placeholder="2026-11-01" value={form.startDate} error={errors.startDate} onChangeText={value => updateField('startDate', value)} />
      <AdminInput colors={colors} label="End date (YYYY-MM-DD)" autoCapitalize="none" placeholder="2026-11-30" value={form.endDate} error={errors.endDate} onChangeText={value => updateField('endDate', value)} />
      <AdminText colors={colors}>Status: {form.status}</AdminText>
      <View style={styles.actions}>{statuses.map(status => <AdminButton key={status} colors={colors} title={`${form.status === status ? '✓ ' : ''}${status}`} variant={form.status === status ? 'primary' : 'secondary'} onPress={() => setForm(current => ({ ...current, status }))} />)}</View>
      {Object.keys(errors).length > 0 && <AdminText colors={colors}>⚠ Please correct the highlighted fields above.</AdminText>}
      <AdminButton colors={colors} title="Save challenge" onPress={save} />
    </AdminModal>}
    {deleting && <ConfirmModal colors={colors} title="Delete challenge?" message={`Delete “${deleting.title}” and its sample participation entries? This cannot be undone in this session.`} action="Confirm deletion" onClose={() => setDeleting(null)} onConfirm={() => { vm.deleteChallenge(deleting.id); setDeleting(null); }} />}
  </AdminLayout>;
}
const styles = StyleSheet.create({ actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 } });
