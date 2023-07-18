import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridCellParams } from '@mui/x-data-grid';
import { Button, IconButton, Snackbar } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AssignmentIcon from '@mui/icons-material/Assignment';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import PlanService from '../../../Services/PlanService';
import { IPlanModel } from '../../../Models/IPlanModel';
import useTitle from '../../../hooks/useTitle';


const Plans = () => {
  const [plans, setPlans] = useState<IPlanModel[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<IPlanModel | null>(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const navigate = useNavigate();
  useTitle("תוכניות");

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const fetchedPlans = await PlanService.getAllPlans();
        const plansWithIds = fetchedPlans.map((plan, index) => ({
          ...plan,
          id: plan._id,
        }));
        setPlans(plansWithIds);
      } catch (error: any) {
        console.error('Failed to fetch plans:', error);
      }
    };

    fetchPlans();
  }, []);

  const handleDeletePlan = (plan: IPlanModel) => {
    setSelectedPlan(plan);
    setDeleteConfirmationOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedPlan) {
      try {
        await PlanService.deletePlan(selectedPlan._id);
        setDeleteConfirmationOpen(false);
        setSelectedPlan(null);
        setPlans(plans.filter((plan) => plan._id !== selectedPlan._id));
        setSnackbarMessage('Plan deleted successfully.');
        setSnackbarOpen(true);
      } catch (error) {
        setSnackbarMessage('Failed to delete plan.');
        setSnackbarOpen(true);
      }
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmationOpen(false);
    setSelectedPlan(null);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'שם תוכנית',
      width: 200,
    },
    {
      field: 'numberOfQuestions',
      headerName: 'מספר שאלות',
      width: 200,
      valueGetter: (params: GridCellParams) => {
        const plan = params.row as IPlanModel;
        return plan.quiz.length;
      },
    },
    {
      field: 'actions',
      headerName: 'פעולות',
      width: 120,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params: GridCellParams) => (
        <div>
          <IconButton onClick={() => handleDeletePlan(params.row as IPlanModel)}>
            <DeleteIcon className="delete-button" />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <div style={{ height: 400, width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 style={{ flex: 1 }}>רשימת תוכניות</h1>
        <Button
          type="submit"
          variant="contained"
          onClick={() => navigate('/add-plan')}
          className='btn-top'
        >
          הוספת תוכנית<AssignmentIcon />
        </Button>
      </div>
      <div>
        <DataGrid rows={plans} columns={columns} autoHeight />
        <Dialog open={deleteConfirmationOpen} onClose={handleCancelDelete}>
          <DialogTitle>מחק תוכנית</DialogTitle>
          <DialogContent>
          ?אתה בטוח שברצונך למחוק את התוכנית הזו
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelDelete}>ביטול</Button>
            <Button onClick={handleConfirmDelete} autoFocus>
              מחיקה
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          open={snackbarOpen}
          message={snackbarMessage}
          onClose={handleSnackbarClose}
          autoHideDuration={3000}
        />
      </div>
    </div>
  );
};

export default Plans;
