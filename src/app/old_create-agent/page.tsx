'use client';
import AgentForm from './components/AgentForm';
import Link from 'next/link';
export default function CreateAgentPage() {
  return (
    <div className="flex min-h-screen w-screen flex-col items-center justify-center bg-black p-4 text-white">
      <h1 className="mb-8 text-3xl font-bold">Create Your Agent</h1>
      <p className="mb-8">This is the form to create your own agents.</p>
      <AgentForm />
      <Link href="/">
        <button className="mt-8 rounded-md border border-gray-600 bg-transparent px-6 py-3 text-center font-medium text-white transition-colors hover:bg-gray-800">
          Back to Home
        </button>
      </Link>
    </div>
  );
}