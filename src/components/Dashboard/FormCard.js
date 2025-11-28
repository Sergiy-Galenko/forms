import React from 'react';
import { FiEdit } from '@react-icons/all-files/fi/FiEdit';
import { FiBarChart2 } from '@react-icons/all-files/fi/FiBarChart2';
import { FiTrash2 } from '@react-icons/all-files/fi/FiTrash2';
import { FiCopy } from '@react-icons/all-files/fi/FiCopy';
import { FiFileText } from '@react-icons/all-files/fi/FiFileText';
import { useForms } from '../../context/FormsContext';
import { useToast } from '../UI/Toast';
import Card from '../UI/Card';
import Button from '../UI/Button';
import { FORM_STATUS } from '../../types';
import './FormCard.css';

const FormCard = ({ form }) => {
    const { setView, setCurrentForm, deleteForm } = useForms();
    const toast = useToast();

    const handleEdit = () => {
        setCurrentForm(form);
        setView('edit');
    };

    const handleStats = () => {
        setCurrentForm(form);
        setView('stats');
    };

    const handleDelete = () => {
        if (window.confirm(`Видалити форму "${form.title}"?`)) {
            deleteForm(form.id);
            toast.success('Форму видалено');
        }
    };

    const handleCopyLink = () => {
        const url = `${window.location.origin}/form/${form.id}`;
        navigator.clipboard.writeText(url);
        toast.success('Посилання скопійовано!');
    };

    const statusColors = {
        [FORM_STATUS.ACTIVE]: '#10b981',
        [FORM_STATUS.DRAFT]: '#f59e0b',
        [FORM_STATUS.CLOSED]: '#6b7280'
    };

    const statusLabels = {
        [FORM_STATUS.ACTIVE]: 'Активна',
        [FORM_STATUS.DRAFT]: 'Чернетка',
        [FORM_STATUS.CLOSED]: 'Закрита'
    };

    const responseCount = form.responses?.length || 0;
    const questionCount = form.questions?.length || 0;

    return (
        <Card hoverable className="form-card">
            <div className="form-card-header">
                <div className="form-card-icon">
                    <FiFileText />
                </div>
                <span
                    className="form-card-status"
                    style={{ backgroundColor: statusColors[form.status] }}
                >
                    {statusLabels[form.status]}
                </span>
            </div>

            <div className="form-card-body">
                <h3 className="form-card-title">
                    {form.title || 'Без назви'}
                </h3>
                {form.description && (
                    <p className="form-card-description">{form.description}</p>
                )}

                <div className="form-card-meta">
                    <div className="meta-item">
                        <span className="meta-label">Питань:</span>
                        <span className="meta-value">{questionCount}</span>
                    </div>
                    <div className="meta-item">
                        <span className="meta-label">Відповідей:</span>
                        <span className="meta-value">{responseCount}</span>
                    </div>
                </div>

                <div className="form-card-date">
                    Створено: {new Date(form.createdAt).toLocaleDateString('uk-UA')}
                </div>
            </div>

            <div className="form-card-actions">
                <Button
                    variant="secondary"
                    size="sm"
                    icon={FiEdit}
                    onClick={handleEdit}
                >
                    Редагувати
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    icon={FiBarChart2}
                    onClick={handleStats}
                >
                    Статистика
                </Button>
                <div className="form-card-menu">
                    <Button
                        variant="ghost"
                        size="sm"
                        icon={FiCopy}
                        onClick={handleCopyLink}
                        title="Копіювати посилання"
                    />
                    <Button
                        variant="ghost"
                        size="sm"
                        icon={FiTrash2}
                        onClick={handleDelete}
                        title="Видалити"
                    />
                </div>
            </div>
        </Card>
    );
};

export default FormCard;
