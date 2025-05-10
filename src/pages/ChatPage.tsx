import { useParams } from 'react-router';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Send, Edit2, Save, Download, FileText } from 'lucide-react';
import {
	Document,
	Page,
	Text,
	View,
	StyleSheet,
	pdf,
} from '@react-pdf/renderer';

export interface ContractReport {
	contract_type: string;
	contract_purpose: string;
	parties: Array<{
		name: string;
		role: string;
		contact_info: {
			email: string;
			phone: string;
		};
	}>;
	contract_details: {
		asset_description: string;
		purchase_price: number;
	};
	financial_structure: {
		markup_rate: string;
		payment_terms: string;
	};
	timeline: {
		start_date: string;
		end_date: string;
	};
	sharia_compliance_notes: string[];
	applicable_standards: {
		FAS: string[];
		Sharia: string[];
	};
	executive_summary: string;
}

interface Message {
	id: string;
	content: string;
	sender: 'user' | 'assistant';
	timestamp: string;
	sectionId: string;
}

interface ConsultationDetails {
	id: string;
	title: string;
	summary: string;
	source: string;
	status: string;
}

interface Section {
	id: string;
	title: string;
	content: string;
	isApproved: boolean;
	messages: Message[];
	finalContent?: string;
}

interface Chapter {
	id: string;
	title: string;
	sections: Section[];
	isApproved: boolean;
}

interface ConsultantResponse {
	title: string;
	response: string;
	summary: string;
	source: string;
	report: ContractReport;
}

interface ContractFormat {
	title: string;
	preamble: string;
	chapters: Chapter[];
	closing: string;
	applicable_standards: string[];
}

interface EditableContract extends ContractFormat {
	isEditing?: boolean;
}

// Test data
const mockConsultation: ConsultationDetails = {
	id: '1',
	title: 'Consultation Marketing Digital',
	summary:
		'Analyse approfondie de la stratégie marketing digitale pour améliorer la présence en ligne',
	source: 'Demande client via formulaire web',
	status: 'in_progress',
};

const mockChapters: Chapter[] = [];

const mockMessages: Message[] = [
	{
		id: '1',
		content:
			'Bonjour, je souhaite une analyse de ma stratégie marketing digitale.',
		sender: 'user',
		timestamp: '2024-03-20T10:00:00',
		sectionId: '1-1',
	},
	{
		id: '2',
		content:
			'Bonjour, je suis ravi de vous aider avec votre stratégie marketing digitale. Pouvez-vous me donner plus de détails sur vos objectifs actuels ?',
		sender: 'assistant',
		timestamp: '2024-03-20T10:01:00',
		sectionId: '1-2',
	},
];

// Modifier la fonction callAgentAPI
const callAgentAPI = async (query: string): Promise<ConsultantResponse> => {
	try {
		const response = await fetch(
			'https://multi-agents-coordination.onrender.com/v1/consultant',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ query }),
			}
		);

		if (!response.ok) {
			throw new Error("Erreur lors de l'appel à l'API");
		}

		const data = await response.json();
		return data as ConsultantResponse;
	} catch (error) {
		console.error('Erreur API:', error);
		throw error;
	}
};

const callContractorAPI = async (report: any): Promise<ContractFormat> => {
	try {
		console.log('Envoi du rapport au contractor:', report);
		const response = await fetch(
			'https://multi-agents-coordination.onrender.com/v1/contractor',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
				body: JSON.stringify(report),
			}
		);

		if (!response.ok) {
			const errorText = await response.text();
			console.error('Erreur API contractor - Status:', response.status);
			console.error('Erreur API contractor - Response:', errorText);
			throw new Error(
				`Erreur API contractor (${response.status}): ${errorText}`
			);
		}

		const data = await response.json();
		console.log('Réponse du contractor:', data);
		return data as ContractFormat;
	} catch (error) {
		console.error('Erreur API contractor:', error);
		throw error;
	}
};

// Simuler la réponse du consultant
const simulateConsultantResponse = (query: string): ConsultantResponse => {
	const defaultReport: ContractReport = {
		contract_type: 'Murabaha',
		contract_purpose:
			'Analyse approfondie des besoins en financement islamique',
		parties: [
			{
				name: 'Client',
				role: 'Acheteur',
				contact_info: {
					email: 'client@example.com',
					phone: '+1234567890',
				},
			},
		],
		contract_details: {
			asset_description: 'Équipement industriel',
			purchase_price: 100000,
		},
		financial_structure: {
			markup_rate: '5%',
			payment_terms: '12 mois',
		},
		timeline: {
			start_date: new Date().toISOString(),
			end_date: new Date(
				Date.now() + 365 * 24 * 60 * 60 * 1000
			).toISOString(),
		},
		sharia_compliance_notes: [
			'Conforme aux principes de la Murabaha',
			'Respect des standards AAOIFI',
		],
		applicable_standards: {
			FAS: ['FAS 4', 'FAS 28'],
			Sharia: ['SS 9'],
		},
		executive_summary:
			'Analyse approfondie des besoins en financement islamique',
	};

	return {
		response: `Voici ma réponse à votre question : "${query}". Je peux vous aider à finaliser cette section.`,
		title: 'Contrat de Financement Islamique',
		summary: 'Analyse approfondie des besoins en financement islamique',
		source: 'Consultant ISDBI',
		report: defaultReport,
	};
};

// Styles pour le PDF (améliorés)
const styles = StyleSheet.create({
	page: {
		padding: 40,
		backgroundColor: '#ffffff',
	},
	title: {
		fontSize: 32,
		marginBottom: 32,
		textAlign: 'center',
		fontWeight: 'bold',
		letterSpacing: 1.2,
	},
	section: {
		marginBottom: 32,
	},
	heading: {
		fontSize: 20,
		marginBottom: 14,
		fontWeight: 'bold',
		color: '#1a237e',
		letterSpacing: 0.5,
	},
	subheading: {
		fontSize: 16,
		marginBottom: 8,
		fontWeight: 'bold',
		color: '#3949ab',
	},
	text: {
		fontSize: 13,
		marginBottom: 12,
		lineHeight: 1.7,
		color: '#222',
	},
	list: {
		marginLeft: 24,
		marginBottom: 8,
	},
	listItem: {
		fontSize: 13,
		marginBottom: 6,
		color: '#222',
	},
});

// Composant PDF
const ContractPDF = ({ contract }: { contract: ContractFormat }) => (
	<Document>
		<Page size="A4" style={styles.page}>
			<Text style={styles.title}>{contract.title}</Text>

			<View style={styles.section}>
				<Text style={styles.heading}>Preamble</Text>
				<Text style={styles.text}>{contract.preamble}</Text>
			</View>

			<View style={styles.section}>
				<Text style={styles.heading}>Applicable Standards</Text>
				<View style={styles.list}>
					{contract.applicable_standards.map((standard, index) => (
						<Text key={index} style={styles.listItem}>
							• {standard}
						</Text>
					))}
				</View>
			</View>

			{contract.chapters.map((chapter, chapterIndex) => (
				<View key={chapterIndex} style={styles.section} break>
					<Text style={styles.heading}>
						Chapter {chapterIndex + 1}: {chapter.title}
					</Text>
					{chapter.sections.map((section, sectionIndex) => (
						<View key={sectionIndex} style={styles.section}>
							<Text style={styles.subheading}>
								Section {sectionIndex + 1}: {section.title}
							</Text>
							<Text style={styles.text}>{section.content}</Text>
						</View>
					))}
				</View>
			))}

			<View style={styles.section}>
				<Text style={styles.heading}>Closing</Text>
				<Text style={styles.text}>{contract.closing}</Text>
			</View>
		</Page>
	</Document>
);

export default function ChatPage() {
	const { id } = useParams();
	const [newMessage, setNewMessage] = useState('');
	const [consultationDetails, setConsultationDetails] =
		useState<ConsultationDetails>(mockConsultation);
	const [chapters, setChapters] = useState<Chapter[]>([]);
	const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(
		null
	);
	const [selectedSection, setSelectedSection] = useState<Section | null>(
		null
	);
	const [isDarkMode, setIsDarkMode] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [showSidebar, setShowSidebar] = useState(true);
	const [showContract, setShowContract] = useState(true);
	const [editingSection, setEditingSection] = useState<{
		chapterIndex: number;
		sectionIndex: number;
	} | null>(null);
	const [editedContent, setEditedContent] = useState('');
	const [generatedContract, setGeneratedContract] =
		useState<EditableContract | null>(null);
	const [isGenerating, setIsGenerating] = useState(false);

	const handleSendMessage = async () => {
		if (newMessage.trim() && selectedSection) {
			setIsLoading(true);
			const message: Message = {
				id: Date.now().toString(),
				content: newMessage,
				sender: 'user',
				timestamp: new Date().toISOString(),
				sectionId: selectedSection.id,
			};

			// Mettre à jour les messages de la section
			setChapters((prev) =>
				prev.map((chapter) => {
					if (chapter.id === selectedChapter?.id) {
						return {
							...chapter,
							sections: chapter.sections.map((section) => {
								if (section.id === selectedSection.id) {
									const updatedMessages = [
										...(section.messages || []),
										message,
									];
									return {
										...section,
										messages: updatedMessages,
									};
								}
								return section;
							}),
						};
					}
					return chapter;
				})
			);

			// Mettre à jour la section sélectionnée avec le nouveau message
			setSelectedSection((prev) => {
				if (prev) {
					return {
						...prev,
						messages: [...(prev.messages || []), message],
					};
				}
				return prev;
			});

			setNewMessage('');

			try {
				// Simuler la réponse du consultant
				const agentResponse = simulateConsultantResponse(newMessage);

				// Mettre à jour les détails de la consultation
				setConsultationDetails((prev) => ({
					...prev,
					title: agentResponse.title || prev.title,
					summary: agentResponse.summary || prev.summary,
					source: agentResponse.source || prev.source,
				}));

				const response: Message = {
					id: (Date.now() + 1).toString(),
					content: agentResponse.response,
					sender: 'assistant',
					timestamp: new Date().toISOString(),
					sectionId: selectedSection.id,
				};

				setChapters((prev) =>
					prev.map((chapter) => {
						if (chapter.id === selectedChapter?.id) {
							return {
								...chapter,
								sections: chapter.sections.map((section) => {
									if (section.id === selectedSection.id) {
										const updatedMessages = [
											...(section.messages || []),
											response,
										];
										return {
											...section,
											messages: updatedMessages,
										};
									}
									return section;
								}),
							};
						}
						return chapter;
					})
				);

				// Mettre à jour la section sélectionnée avec la réponse
				setSelectedSection((prev) => {
					if (prev) {
						return {
							...prev,
							messages: [...(prev.messages || []), response],
						};
					}
					return prev;
				});
			} catch (error) {
				console.error(
					'Erreur lors de la simulation de la réponse:',
					error
				);
				const errorMessage: Message = {
					id: (Date.now() + 1).toString(),
					content:
						"Désolé, une erreur s'est produite lors de la communication avec l'agent.",
					sender: 'assistant',
					timestamp: new Date().toISOString(),
					sectionId: selectedSection.id,
				};

				// Mettre à jour avec le message d'erreur
				setChapters((prev) =>
					prev.map((chapter) => {
						if (chapter.id === selectedChapter?.id) {
							return {
								...chapter,
								sections: chapter.sections.map((section) => {
									if (section.id === selectedSection.id) {
										return {
											...section,
											messages: [
												...(section.messages || []),
												errorMessage,
											],
										};
									}
									return section;
								}),
							};
						}
						return chapter;
					})
				);

				setSelectedSection((prev) => {
					if (prev) {
						return {
							...prev,
							messages: [...(prev.messages || []), errorMessage],
						};
					}
					return prev;
				});
			} finally {
				setIsLoading(false);
			}
		}
	};

	const handleChapterSelect = (chapter: Chapter) => {
		setSelectedChapter(chapter);
		setSelectedSection(null);
	};

	const handleSectionSelect = (section: Section) => {
		// Créer un message initial de l'utilisateur uniquement
		const initialMessage: Message = {
			id: Date.now().toString(),
			content: `I would like to discuss the section "${section.title}".`,
			sender: 'user',
			timestamp: new Date().toISOString(),
			sectionId: section.id,
		};

		// Mettre à jour les messages de la section avec uniquement le message de l'utilisateur
		setChapters((prev) =>
			prev.map((chapter) => {
				if (chapter.sections.some((s) => s.id === section.id)) {
					return {
						...chapter,
						sections: chapter.sections.map((s) => {
							if (s.id === section.id) {
								return {
									...s,
									messages: [initialMessage],
								};
							}
							return s;
						}),
					};
				}
				return chapter;
			})
		);

		setSelectedSection(section);
		setSelectedChapter(
			chapters.find((chapter) =>
				chapter.sections.some((s) => s.id === section.id)
			) || null
		);
	};

	const handleEditSection = (chapterIndex: number, sectionIndex: number) => {
		if (!generatedContract) return;
		const section =
			generatedContract.chapters[chapterIndex].sections[sectionIndex];
		setEditingSection({ chapterIndex, sectionIndex });
		setEditedContent(section.content);
	};

	const handleSaveEdit = () => {
		if (!generatedContract || !editingSection) return;

		setGeneratedContract((prev) => {
			if (!prev) return null;
			const newChapters = [...prev.chapters];
			newChapters[editingSection.chapterIndex].sections[
				editingSection.sectionIndex
			].content = editedContent;
			return { ...prev, chapters: newChapters };
		});

		setEditingSection(null);
		setEditedContent('');
	};

	const handleCancelEdit = () => {
		setEditingSection(null);
		setEditedContent('');
	};

	const handleApproveSection = () => {
		if (selectedChapter && selectedSection) {
			// Trouver le dernier message de l'utilisateur
			const lastUserMessage = selectedSection.messages
				.filter((msg) => msg.sender === 'user')
				.pop();

			// Utiliser le dernier message de l'utilisateur comme contenu mis à jour
			const updatedContent =
				lastUserMessage?.content || selectedSection.content;

			// Mettre à jour le contrat généré si disponible
			if (generatedContract) {
				setGeneratedContract((prev) => {
					if (!prev) return null;
					const newChapters = prev.chapters.map((chapter) => {
						if (chapter.title === selectedChapter.title) {
							return {
								...chapter,
								sections: chapter.sections.map((section) => {
									if (
										section.title === selectedSection.title
									) {
										return {
											...section,
											content: updatedContent,
										};
									}
									return section;
								}),
							};
						}
						return chapter;
					});
					return { ...prev, chapters: newChapters };
				});
			}

			// Mettre à jour les chapitres
			setChapters((prev) =>
				prev.map((chapter) => {
					if (chapter.id === selectedChapter.id) {
						const updatedSections = chapter.sections.map(
							(section) => {
								if (section.id === selectedSection.id) {
									return {
										...section,
										isApproved: true,
										finalContent: updatedContent,
									};
								}
								return section;
							}
						);

						const allSectionsApproved = updatedSections.every(
							(section) => section.isApproved
						);

						return {
							...chapter,
							sections: updatedSections,
							isApproved: allSectionsApproved,
						};
					}
					return chapter;
				})
			);
		}
	};

	const handleApproveAll = () => {
		if (!generatedContract) return;

		// Mettre à jour le contrat généré avec tous les derniers messages des utilisateurs
		setGeneratedContract((prev) => {
			if (!prev) return null;
			const newChapters = prev.chapters.map((chapter) => {
				const updatedSections = chapter.sections.map((section) => {
					// Trouver le dernier message de l'utilisateur pour cette section
					const lastUserMessage = chapters
						.find((c) => c.title === chapter.title)
						?.sections.find((s) => s.title === section.title)
						?.messages.filter((msg) => msg.sender === 'user')
						.pop();

					return {
						...section,
						content: lastUserMessage?.content || section.content,
					};
				});

				return {
					...chapter,
					sections: updatedSections,
				};
			});

			return { ...prev, chapters: newChapters };
		});

		// Mettre à jour les chapitres
		setChapters((prev) =>
			prev.map((chapter) => {
				const updatedSections = chapter.sections.map((section) => {
					const lastUserMessage = section.messages
						.filter((msg) => msg.sender === 'user')
						.pop();

					return {
						...section,
						isApproved: true,
						finalContent:
							lastUserMessage?.content || section.content,
					};
				});

				return {
					...chapter,
					sections: updatedSections,
					isApproved: true,
				};
			})
		);
	};

	const generateContract = async () => {
		try {
			setIsGenerating(true);
			// Créer un rapport basé sur la réponse du consultant
			const report: ContractReport = {
				contract_type: 'Murabaha',
				contract_purpose: consultationDetails.summary,
				parties: [
					{
						name: 'Client',
						role: 'Acheteur',
						contact_info: {
							email: 'client@example.com',
							phone: '+1234567890',
						},
					},
				],
				contract_details: {
					asset_description: 'Équipement industriel',
					purchase_price: 100000,
				},
				financial_structure: {
					markup_rate: '5%',
					payment_terms: '12 mois',
				},
				timeline: {
					start_date: new Date().toISOString(),
					end_date: new Date(
						Date.now() + 365 * 24 * 60 * 60 * 1000
					).toISOString(),
				},
				sharia_compliance_notes: [
					'Conforme aux principes de la Murabaha',
					'Respect des standards AAOIFI',
				],
				applicable_standards: {
					FAS: ['FAS 4', 'FAS 28'],
					Sharia: ['SS 9'],
				},
				executive_summary: consultationDetails.summary,
			};

			// Appeler l'API du contractor
			const contractFormat = await callContractorAPI(report);
			setGeneratedContract({ ...contractFormat, isEditing: false });

			// Mettre à jour les chapitres dans la sidebar
			const newChapters: Chapter[] = contractFormat.chapters.map(
				(chapter, index) => ({
					id: (index + 1).toString(),
					title: chapter.title,
					isApproved: false,
					sections: chapter.sections.map((section, sIndex) => ({
						id: `${index + 1}-${sIndex + 1}`,
						title: section.title,
						content: section.content,
						isApproved: false,
						messages: [],
					})),
				})
			);

			setChapters(newChapters);
		} catch (error) {
			console.error('Erreur lors de la génération du contrat:', error);
			alert(
				"Une erreur s'est produite lors de la génération du contrat."
			);
		} finally {
			setIsGenerating(false);
		}
	};

	const downloadContract = () => {
		if (!generatedContract) return;

		const contractContent = `
${generatedContract.title}

${generatedContract.preamble}

Standards Applicables:
${generatedContract.applicable_standards.join('\n')}

${generatedContract.chapters
	.map(
		(chapter) => `
${chapter.title}
${chapter.sections
	.map(
		(section) => `
${section.title}
${section.content}
`
	)
	.join('\n')}
`
	)
	.join('\n')}

${generatedContract.closing}
    `;

		const blob = new Blob([contractContent], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = 'contract.txt';
		link.click();
	};

	const downloadContractAsPDF = async () => {
		if (!generatedContract) return;

		try {
			const blob = await pdf(
				<ContractPDF contract={generatedContract} />
			).toBlob();
			const url = URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = 'contract.pdf';
			link.click();
			URL.revokeObjectURL(url);
		} catch (error) {
			console.error('Error generating PDF:', error);
			alert(
				`Error generating PDF: ${
					error instanceof Error ? error.message : 'Unknown error'
				}`
			);
		}
	};

	// Vérifier si tous les chapitres sont approuvés
	const areAllChaptersApproved = () => {
		return chapters.every((chapter) => chapter.isApproved);
	};

	return (
		<div className="flex flex-col lg:flex-row h-screen bg-gray-100 dark:bg-gray-800">
			{/* Mobile Menu Button */}
			<button
				className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors"
				onClick={() => setShowSidebar(!showSidebar)}
				aria-label="Toggle sidebar"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M4 6h16M4 12h16M4 18h16"
					/>
				</svg>
			</button>

			{/* Sidebar */}
			<div
				className={`${
					showSidebar ? 'translate-x-0' : '-translate-x-full'
				} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-80 bg-white dark:bg-gray-900 border-r p-4 md:p-6 flex flex-col shadow-lg transition-transform duration-300 ease-in-out overflow-y-auto`}
			>
				<Card className="mb-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
					<CardHeader>
						<CardTitle className="text-xl font-semibold">
							Consultation Details
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div>
								<h3 className="font-semibold text-sm text-gray-300">
									Title
								</h3>
								<p className="text-sm">
									{consultationDetails.title}
								</p>
							</div>
							<div>
								<h3 className="font-semibold text-sm text-gray-300">
									Summary
								</h3>
								<p className="text-sm">
									{consultationDetails.summary}
								</p>
							</div>
							<div>
								<h3 className="font-semibold text-sm text-gray-300">
									Source
								</h3>
								<p className="text-sm">
									{consultationDetails.source}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Chapters</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{chapters.length === 0 ? (
								<div className="text-center">
									<p className="text-gray-500 dark:text-gray-400 mb-4">
										Start a conversation to generate
										chapters
									</p>
									<Button
										onClick={generateContract}
										className="bg-blue-500 text-white rounded-full p-3 hover:bg-blue-600 transition-colors"
										disabled={isGenerating}
									>
										{isGenerating
											? 'Generating...'
											: 'Generate Contract'}
									</Button>
								</div>
							) : (
								chapters.map((chapter) => (
									<div
										key={chapter.id}
										className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
										onClick={() =>
											handleChapterSelect(chapter)
										}
									>
										<h3 className="font-semibold mb-2">
											{chapter.title}
										</h3>
										<div className="space-y-2">
											{chapter.sections.map((section) => (
												<div
													key={section.id}
													className="flex items-center justify-between text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded transition-colors"
													onClick={(e) => {
														e.stopPropagation();
														handleSectionSelect(
															section
														);
													}}
												>
													<div className="flex items-center space-x-2">
														{section.isApproved ? (
															<span className="text-green-500">
																✓
															</span>
														) : (
															<span className="w-4"></span>
														)}
														<span>
															{section.title}
														</span>
													</div>
												</div>
											))}
										</div>
									</div>
								))
							)}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Main Chat Area */}
			<div className="flex-1 flex flex-col min-w-0">
				{selectedSection ? (
					<div className="flex-1 flex flex-col bg-white p-4 shadow-lg dark:bg-gray-800">
						{/* Chat Messages */}
						<div className="flex-1 overflow-y-auto space-y-4 p-4">
							{selectedSection.messages &&
								selectedSection.messages.map((message) => (
									<div
										key={message.id}
										className={`flex ${
											message.sender === 'user'
												? 'justify-end'
												: 'justify-start'
										}`}
									>
										<div
											className={`max-w-[85%] md:max-w-[70%] p-3 rounded-lg ${
												message.sender === 'user'
													? 'bg-blue-600 text-white'
													: 'bg-gray-100 dark:bg-gray-700 dark:text-white'
											}`}
										>
											<p className="whitespace-pre-wrap break-words">
												{message.content}
											</p>
											<span className="text-xs text-gray-500 dark:text-gray-400">
												{new Date(
													message.timestamp
												).toLocaleTimeString()}
											</span>
										</div>
									</div>
								))}
							{isLoading && (
								<div className="flex justify-start">
									<div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
										<div className="flex space-x-2">
											<div
												className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
												style={{
													animationDelay: '0ms',
												}}
											></div>
											<div
												className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
												style={{
													animationDelay: '150ms',
												}}
											></div>
											<div
												className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
												style={{
													animationDelay: '300ms',
												}}
											></div>
										</div>
									</div>
								</div>
							)}
						</div>

						{/* Input Area */}
						<div className="border-t p-4 bg-white dark:bg-gray-900">
							<div className="flex space-x-2">
								<Input
									value={newMessage}
									onChange={(e) =>
										setNewMessage(e.target.value)
									}
									placeholder="Type your message..."
									onKeyPress={(e) =>
										e.key === 'Enter' && handleSendMessage()
									}
									className="flex-1 rounded-lg"
									disabled={isLoading}
								/>
								{!selectedSection.isApproved && (
									<Button
										onClick={handleApproveSection}
										className="bg-green-500 text-white rounded-full p-3 hover:bg-green-600 transition-colors"
										disabled={isLoading}
									>
										✓ Approve
									</Button>
								)}
								<Button
									onClick={handleSendMessage}
									className="bg-blue-500 text-white rounded-full p-3 hover:bg-blue-600 transition-colors"
									disabled={isLoading}
								>
									<Send className="h-5 w-5" />
								</Button>
							</div>
						</div>
					</div>
				) : (
					<div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-800">
						<p className="text-gray-500 dark:text-gray-400">
							Select a section to start the discussion
						</p>
					</div>
				)}
			</div>

			{/* Contract Panel */}
			<div
				className={`${
					showContract ? 'translate-x-0' : 'translate-x-full'
				} lg:translate-x-0 fixed lg:static inset-y-0 right-0 z-40 w-80 md:w-96 bg-white dark:bg-gray-900 border-l p-4 md:p-6 flex flex-col shadow-lg transition-transform duration-300 ease-in-out overflow-y-auto`}
			>
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-lg font-semibold">
						Contract Generation
					</h2>
					<div className="flex space-x-2">
						{chapters.length > 0 && !areAllChaptersApproved() && (
							<Button
								onClick={handleApproveAll}
								className="bg-green-500 text-white rounded-full p-2 hover:bg-green-600 transition-colors"
							>
								✓ Approve All
							</Button>
						)}
						<button
							className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
							onClick={() => setShowContract(false)}
							aria-label="Close contract panel"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>
				</div>

				<div className="flex-1 overflow-y-auto p-2">
					{!generatedContract ? (
						<div className="flex flex-col items-center justify-center h-full">
							<Button
								onClick={generateContract}
								className="bg-blue-500 text-white rounded-full p-3 hover:bg-blue-600 transition-colors"
								disabled={isGenerating}
							>
								{isGenerating
									? 'Generating...'
									: 'Generate Contract'}
							</Button>
						</div>
					) : (
						<div className="space-y-4">
							<div className="border p-4 rounded-lg shadow-md bg-gray-50 dark:bg-gray-700">
								<div className="flex justify-between items-center mb-4">
									<h3 className="text-xl font-bold">
										{generatedContract.title}
									</h3>
									<Button
										onClick={() =>
											setGeneratedContract((prev) =>
												prev
													? {
															...prev,
															isEditing:
																!prev.isEditing,
													  }
													: null
											)
										}
										className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition-colors"
									>
										{generatedContract.isEditing
											? 'Finish Editing'
											: 'Edit Contract'}
									</Button>
								</div>

								<div className="mb-4">
									<h4 className="font-semibold mb-2">
										Preamble
									</h4>
									{generatedContract.isEditing ? (
										<textarea
											value={generatedContract.preamble}
											onChange={(e) =>
												setGeneratedContract((prev) =>
													prev
														? {
																...prev,
																preamble:
																	e.target
																		.value,
														  }
														: null
												)
											}
											className="w-full p-2 border rounded"
											rows={3}
										/>
									) : (
										<p>{generatedContract.preamble}</p>
									)}
								</div>

								<h4 className="font-semibold mb-2">
									Applicable Standards:
								</h4>
								<ul className="list-disc pl-5 mb-4">
									{generatedContract.applicable_standards.map(
										(standard, index) => (
											<li key={index}>{standard}</li>
										)
									)}
								</ul>

								{generatedContract.chapters.map(
									(chapter, chapterIndex) => (
										<div
											key={chapterIndex}
											className="mb-4"
										>
											<h4 className="text-lg font-semibold mb-2">
												{chapter.title}
											</h4>
											{chapter.sections.map(
												(section, sectionIndex) => (
													<div
														key={sectionIndex}
														className="mb-2"
													>
														<div className="flex justify-between items-center">
															<h5 className="font-medium">
																{section.title}
															</h5>
															{generatedContract.isEditing && (
																<Button
																	onClick={() =>
																		handleEditSection(
																			chapterIndex,
																			sectionIndex
																		)
																	}
																	className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition-colors"
																>
																	<Edit2 className="h-4 w-4" />
																</Button>
															)}
														</div>
														{editingSection?.chapterIndex ===
															chapterIndex &&
														editingSection?.sectionIndex ===
															sectionIndex ? (
															<div className="mt-2">
																<textarea
																	value={
																		editedContent
																	}
																	onChange={(
																		e
																	) =>
																		setEditedContent(
																			e
																				.target
																				.value
																		)
																	}
																	className="w-full p-2 border rounded"
																	rows={4}
																/>
																<div className="flex justify-end space-x-2 mt-2">
																	<Button
																		onClick={
																			handleSaveEdit
																		}
																		className="bg-green-500 text-white rounded-full p-2 hover:bg-green-600 transition-colors"
																	>
																		<Save className="h-4 w-4 mr-1" />
																		Save
																	</Button>
																	<Button
																		onClick={
																			handleCancelEdit
																		}
																		className="bg-gray-500 text-white rounded-full p-2 hover:bg-gray-600 transition-colors"
																	>
																		Cancel
																	</Button>
																</div>
															</div>
														) : (
															<p className="whitespace-pre-wrap">
																{
																	section.content
																}
															</p>
														)}
													</div>
												)
											)}
										</div>
									)
								)}

								<div className="mt-4">
									<h4 className="font-semibold mb-2">
										Closing
									</h4>
									{generatedContract.isEditing ? (
										<textarea
											value={generatedContract.closing}
											onChange={(e) =>
												setGeneratedContract((prev) =>
													prev
														? {
																...prev,
																closing:
																	e.target
																		.value,
														  }
														: null
												)
											}
											className="w-full p-2 border rounded"
											rows={3}
										/>
									) : (
										<p>{generatedContract.closing}</p>
									)}
								</div>
							</div>

							{areAllChaptersApproved() && (
								<div className="flex justify-center space-x-4">
									<Button
										onClick={downloadContract}
										className="bg-green-500 text-white rounded-full p-3 hover:bg-green-600 transition-colors"
									>
										<Download className="h-5 w-5 mr-2" />
										Download TXT
									</Button>
									<Button
										onClick={downloadContractAsPDF}
										className="bg-blue-500 text-white rounded-full p-3 hover:bg-blue-600 transition-colors"
									>
										<FileText className="h-5 w-5 mr-2" />
										Download PDF
									</Button>
								</div>
							)}
						</div>
					)}
				</div>
			</div>

			{/* Mobile Contract Button */}
			<button
				className="lg:hidden fixed bottom-4 right-4 z-50 p-3 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition-colors"
				onClick={() => setShowContract(!showContract)}
				aria-label="Toggle contract panel"
			>
				<Download className="h-6 w-6" />
			</button>
		</div>
	);
}
